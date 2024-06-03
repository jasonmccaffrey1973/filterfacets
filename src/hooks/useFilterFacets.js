import { useState, useCallback } from "react";

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
            newState[facet.id] = { ...newState[facet.id], items: newItems };
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
     *  ---------------------------------------------------------------- */
    const updateSearch = useCallback((accessor, value) => {
        setFilterFacetState(prevState => {
            const newState = { ...prevState };
            newState[accessor].filterdItems = newState[accessor].items.filter(item => item.label.toLowerCase().includes(value.toLowerCase()))
            newState[accessor] = { ...newState[accessor], search: value };
            return newState;
        });
    }, []);



    return {
        filterFacetState,
        expandFacet,
        closeFacet,
        closeAllFacets,
        expandAllFacets,
        toggleFacet,
        toggleSelected,
        selectOnly,
        updateSearch
    };
};

export default useFilterFacets;
