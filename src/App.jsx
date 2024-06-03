import FilterFacet from "./components/FilterFacet";
import useFilterFacets from "./hooks/useFilterFacets";

function App() {
    const INITIAL_STATE = {
        1: { 
          id: 1, 
          accessor: 'status',
          title: 'Status',
          open: false, 
          items: [
          {
            label: 'Open', 
            value: 1, 
            selected: false
          }, {
            label: 'Closed',
            value: 2,
            selected: false
          }, {
            label: 'Pending',
            value: 3,
            selected: false
          }], 
          search: '' },
        2: { 
          id: 2,
          accessor: 'type',
          title: 'Type',
          open: false, 
          items: [
          {
            label:'Feature',
            value: 4,
            selected: false
          },{
            label: 'Bug',
            value: 5,
            selected: false
          },{
            label: 'Enhancement',
            value: 6,
            selected: false
          }], 
          search: '' },
        3: { 
          id: 3,
          accessor: 'priority',
          title: 'Priority',
          open: false, 
          items: [
          { 
            label: 'Low',
            value: 7,
            selected: false
          }, {
            label: 'Medium',
            value: 8,
            selected: false
          },{
            label: 'High',
            value: 9,
            selected: false
          }],
          search: '' },
    };

    const { filterFacetState, closeAllFacets, expandAllFacets, toggleFacet, toggleSelected, selectOnly, updateSearch } = useFilterFacets({ initialState: INITIAL_STATE });

    return (
        <div className="App">
            <header className="App-header">
                <h1>Filter Facets</h1>
            </header>
            <main>
                <button onClick={expandAllFacets}>Expand All</button>
                <button onClick={closeAllFacets}>Close All</button>
                {Object.values(filterFacetState).map(facet => (
                    <FilterFacet
                        key={facet.id}
                        facet={facet}
                        toggleFacet={() => toggleFacet(facet.id)}
                        toggleItem={toggleSelected}
                        selectOnly={selectOnly}
                        updateSearch={updateSearch}
                    />
                ))}
            </main>
        </div>
    );
}

export default App;
