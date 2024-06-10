import { useState, useCallback, useEffect } from "react";

interface FacetItem {
    value: string;
    label: string;
    selected: boolean;
}

interface Facet {
    id: string;
    title: string;
    accessor: string;
    items: FacetItem[];
    originalItems?: FacetItem[];
    filteredItems?: FacetItem[];
    open: boolean;
    allSelected: boolean;
    search?: string;
}

interface InitialState {
    [key: string]: Facet;
}

interface UseFilterFacetsProps {
    initialState: InitialState;
    monoOpen?: boolean;
}

/** ------------------------------------------------------------------------------------------------
 * Custom hook to manage the state of filter facets.
 * @param initialState - Initial state of the filter facets.
 * @param monoOpen - If true, only one facet can be open at a time.
 * @returns An object containing the current state and functions to manipulate the state.
 ** ------------------------------------------------------------------------------------------------ */
const useFilterFacets = ({ initialState, monoOpen = false }: UseFilterFacetsProps) => {
    const [filterFacetState, setFilterFacetState] = useState<InitialState>(initialState);

    /** ------------------------------------------------------------------------------------------------ 
     * Close all facets by setting their 'open' property to false. 
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const closeAllFacets = useCallback(() => {
        setFilterFacetState(prevState =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = { ...prevState[key], open: false };
                return acc;
            }, {} as InitialState)
        );
    }, []);

    /** ------------------------------------------------------------------------------------------------
     *  Expand all facets by setting their 'open' property to true. 
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const expandAllFacets = useCallback(() => {
        setFilterFacetState(prevState =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = { ...prevState[key], open: true };
                return acc;
            }, {} as InitialState)
        );
    }, []);

    /** ------------------------------------------------------------------------------------------------
     *  Toggle the open state of a specific facet. 
     * @param facetId - The ID of the facet to toggle.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const toggleFacet = useCallback((facetId: string) => {
        setFilterFacetState(prevState => ({
            ...prevState,
            [facetId]: {
                ...prevState[facetId],
                open: !prevState[facetId].open,
            },
        }));
    }, []);

    /** ------------------------------------------------------------------------------------------------
     * Expand a specific facet. If monoOpen is true, close all other facets first.
     * @param facetId - The ID of the facet to expand.
     * @returns void 
     ** ------------------------------------------------------------------------------------------------ */
    const expandFacet = useCallback((facetId: string) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            if (monoOpen) {
                Object.keys(newState).forEach(key => {
                    newState[key] = { ...newState[key], open: false };
                });
            }
            newState[facetId] = { ...newState[facetId], open: true };
            return newState;
        });
    }, [monoOpen]);

    /** ------------------------------------------------------------------------------------------------
     * Close a specific facet.
     * @param facetId - The ID of the facet to close.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const closeFacet = useCallback((facetId: string) => {
        setFilterFacetState(prevState => ({
            ...prevState,
            [facetId]: { ...prevState[facetId], open: false },
        }));
    }, []);

    /** ------------------------------------------------------------------------------------------------
     * Toggle the selected state of a specific item within a facet. 
     * @param facet - The facet containing the item.
     * @param item - The item to toggle.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const toggleSelected = useCallback((facet: Facet, item: FacetItem) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            const newItems = facet.items.map(i => {
                if (i.value === item.value) {
                    return { ...i, selected: !i.selected };
                }
                return i;
            });
            const selectedItems = newItems.filter(i => i.selected);
            newState[facet.id] = {
                ...newState[facet.id],
                items: newItems,
                allSelected: selectedItems.length === facet.items.length
            };
            return newState;
        });
    }, []);

    /** ------------------------------------------------------------------------------------------------
     * Select only a specific item within a facet.
     * @param facet - The facet containing the item.
     * @param item - The item to select.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const selectOnly = useCallback((facet: Facet, item: FacetItem) => {
        const facetId = facet.id;
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            newState[facetId] = {
                ...newState[facetId],
                allSelected: false,
                items: newState[facetId].items.map(i => ({
                    ...i,
                    selected: i.value === item.value
                }))
            };
            return newState;
        });
    }, []);

    /** ------------------------------------------------------------------------------------------------
     * Update the search value of a specific facet. 
     * @param accessor - The accessor of the facet to update.
     * @param value - The search value to set.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const updateSearch = useCallback(({ accessor, value }: { accessor: string; value: string }) => {
        setFilterFacetState(prevState => {
            const facetId = Object.keys(prevState).find(key => prevState[key].accessor === accessor);
            if (!facetId) return prevState;

            const facet = prevState[facetId];
            const originalItems = facet.originalItems || facet.items;

            const newItems = value
                ? facet.items.filter(item => item.label.toLowerCase().includes(value.toLowerCase()))
                : originalItems.map(item => ({
                    ...item,
                    selected: facet.items.find(fi => fi.value === item.value)?.selected || false
                }));

            return {
                ...prevState,
                [facetId]: {
                    ...facet,
                    items: newItems,
                    search: value,
                    originalItems
                }
            };
        });
    }, []);

    /** ------------------------------------------------------------------------------------------------
     *  Select all items within a specific facet. 
     * @param facet - The facet to select all items from.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const selectAllItems = useCallback((facet: Facet) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            const newItems = facet.items.map(i => ({ ...i, selected: true }));
            newState[facet.id] = { ...newState[facet.id], items: newItems, allSelected: true };
            return newState;
        });
    }, []);

    /** ------------------------------------------------------------------------------------------------
     *  Deselect all items within a specific facet. 
     * @param facet - The facet to deselect all items from.
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    const deSelectAllItems = useCallback((facet: Facet) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            const newItems = facet.items.map(i => ({ ...i, selected: false }));
            newState[facet.id] = { ...newState[facet.id], items: newItems, allSelected: false };
            return newState;
        });
    }, []);

    /** ------------------------------------------------------------------------------------------------
     *  Add hooks / functions for state change of the filter facets. 
     * @returns void
     ** ------------------------------------------------------------------------------------------------ */
    useEffect(() => {
        console.log('FF State::: ', filterFacetState);
    }, [filterFacetState]);

    return {
        filterFacetState,
        expandFacet,
        closeFacet,
        closeAllFacets,
        expandAllFacets,
        toggleFacet,
        toggleSelected,
        selectOnly,
        updateSearch,
        selectAllItems,
        deSelectAllItems
    };
};

export default useFilterFacets;
