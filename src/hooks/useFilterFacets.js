import { useState, useCallback, useEffect } from "react";

/** ----------------------------------------------------------------
 * Custom hook to manage the state of filter facets.
 * @param {Object} initialState - Initial state of the filter facets.
 * @param {boolean} monoOpen - If true, only one facet can be open at a time.
 * @returns {Object} - An object containing the current state and functions to manipulate the state.
 ** ---------------------------------------------------------------- */

const useFilterFacets = ({ initialState, monoOpen = false }) => {
    const [filterFacetState, setFilterFacetState] = useState(initialState);

    /** ----------------------------------------------------------------
     * Close all facets by setting their 'open' property to false.
     ** ---------------------------------------------------------------- */
    const closeAllFacets = useCallback(() => {
        setFilterFacetState(prevState =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = { ...prevState[key], open: false };
                return acc;
            }, {})
        );
    }, []);

    /** ----------------------------------------------------------------
     * Expand all facets by setting their 'open' property to true.
     ** ---------------------------------------------------------------- */
    const expandAllFacets = useCallback(() => {
        setFilterFacetState(prevState =>
            Object.keys(prevState).reduce((acc, key) => {
                acc[key] = { ...prevState[key], open: true };
                return acc;
            }, {})
        );
    }, []);

    /** ----------------------------------------------------------------
     * Toggle the open state of a specific facet.
     * @param {number} facetId - The ID of the facet to toggle.
     ** ---------------------------------------------------------------- */
    const toggleFacet = useCallback(facetId => {
        setFilterFacetState(prevState => ({
            ...prevState,
            [facetId]: {
                ...prevState[facetId],
                open: !prevState[facetId].open,
            },
        }));
    }, []);

    /** ----------------------------------------------------------------
     * Expand a specific facet. If monoOpen is true, close all other facets first.
     * @param {number} facetId - The ID of the facet to expand.
     ** ---------------------------------------------------------------- */
    const expandFacet = useCallback(facetId => {
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

    /** ----------------------------------------------------------------
     * Close a specific facet.
     * @param {number} facetId - The ID of the facet to close.
     ** ---------------------------------------------------------------- */
    const closeFacet = useCallback(facetId => {
        setFilterFacetState(prevState => ({
            ...prevState,
            [facetId]: { ...prevState[facetId], open: false },
        }));
    }, []);

    /** ----------------------------------------------------------------
     * Toggle the selected state of a specific item within a facet.
     * @param {Object} facet - The facet object containing the item.
     * @param {Object} item - The item object to toggle.
     * @returns {void}
    ** ---------------------------------------------------------------- */
    const toggleSelected = useCallback((facet, item) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            const newItems = facet.items.map(i => {
                if (i.value === item.value) {
                    return { ...i, selected: !i.selected }
                }
                return i
            });
            const selectedItems = newItems.filter(i => i.selected);
            newState[facet.id] = { ...newState[facet.id], items: newItems, allSelected: selectedItems.length === facet.items.length};
            return newState;
        });
    }, []);

    /** ----------------------------------------------------------------
     * Select only a specific item within a facet.
     * @param {Object} facet - The facet object containing the item.
     * @param {Object} item - The item object to select.
     * @returns {void}
     * ---------------------------------------------------------------- */
    const selectOnly = useCallback((facet, item) => {
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

/** ----------------------------------------------------------------
 * Update the search value of a specific facet.
 * @param {string} accessor - The accessor of the facet to update.
 * @param {string} value - The new search value.
 * @returns {void}
 * ---------------------------------------------------------------- */
const updateSearch = useCallback(({ accessor, value }) => {
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

/** ----------------------------------------------------------------
 * Select all items within a specific facet.
 * @param {Object} facet - The facet object to select all items.
 * @returns {void}
 * ---------------------------------------------------------------- */
const selectAllItems = useCallback(facet => {
    setFilterFacetState(prevState => {
        const newState = { ...prevState };
        const newItems = facet.items.map(i => ({ ...i, selected: true }));
        newState[facet.id] = { ...newState[facet.id], items: newItems, allSelected: true};
        return newState;
    });
}, []);

/** ----------------------------------------------------------------
 * Deselect all items within a specific facet.
 * @param {Object} facet - The facet object to deselect all items.
 * @returns {void}
 * ---------------------------------------------------------------- */
const deSelectAllItems = useCallback(facet => {
    setFilterFacetState(prevState => {
        const newState = { ...prevState };
        const newItems = facet.items.map(i => ({ ...i, selected: false }));
        newState[facet.id] = { ...newState[facet.id], items: newItems, allSelected: false};
        return newState;
    });
}, []);

    
/** ----------------------------------------------------------------
  * Add hooks / functions for state change of the filter facets.
  * ---------------------------------------------------------------- */
useEffect(() => {
    console.log('FF State::: ', filterFacetState);
}
, [filterFacetState]);

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
