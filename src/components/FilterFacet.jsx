/* eslint-disable react/prop-types */
import styled from "styled-components"

const FilterFacet = ({facet, toggleFacet, toggleItem, selectOnly, updateSearch}) => {
    const items = facet.filterdItems ?? facet.items;
  return (
    <StyledFilterFacet aria-expanded={facet.open}>
        <div className="facet-header" onClick={toggleFacet}>
            <h3 className="facet-title">{facet.title}</h3>
            <button className="facet-toggle"></button>
        </div>
        <ul className="facet-body">
            <div className="search">
                <input type="search" placeholder={`Search ${facet.title}:`} list={`${facet.title}List`} onChange={updateSearch(facet.accessor)} />
                <datalist id={`${facet.title}List`}>
                    {items.map(item => (
                        <option key={item.value} value={item.label} />
                    ))}
                </datalist>
            </div>
            {facet.items.map(item => {
                const id = `${facet.accessor}-${item.value}`;                
                return (
                    <li className="facet-item" key={id} onClick={()=> toggleItem(facet, item)}>
                        <button className="select-only" onClick={e=>{
                            e.stopPropagation();
                            selectOnly(facet, item)
                        }}>Select Only</button>
                        <input id={id} type="checkbox" value={item.value} checked={item.selected} readOnly />
                        <label htmlFor={id}> {item.label} </label>
                    </li>
                )}       
            )}
        </ul>
        {/* <div className="facet-footer">
        </div> */}
    </StyledFilterFacet>
  )
}


export default FilterFacet

const StyledFilterFacet = styled.div`
    --arrowThickness: 0.1rem;
    --arrowRotation: ${props => props['aria-expanded'] ? '0deg' : '90deg'};
    --contentHeight: ${props => props['aria-expanded'] ? '100%' : '0'};
    display: flex;
    flex-direction: column;
    max-width: 20rem;
    font-family: Arial, sans-serif;
    .facet-header {
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 0.5rem 1rem;
        border-bottom: 1px solid #ccc;
        top: 0;
    }

    .facet-title {
        font-size: 1rem;
        margin: 0;
    }

    .facet-toggle {
        width: 1.5rem;
        height: 1.5rem;
        border: none;
        background-color: transparent;
        position: relative;
        transform: rotate(var(--arrowRotation));
        transition: transform 250ms;
    }

    .facet-toggle::before, .facet-toggle::after {
        content: '';
        position: absolute;
        top: calc(50% - var(--arrowThickness) * 0.5);
        left: calc(50% + var(--arrowThickness) * 0.5);
        width: 0.5rem;
        height: var(--arrowThickness);
        background-color: #999;
    }

    .facet-toggle::before {
        rotate: 45deg;
        transform: translateY(calc(var(--arrowThickness) * 0.5)) translateX(-50%);
    }

    .facet-toggle::after {
        rotate: -45deg;
        transform: translateY(calc(var(--arrowThickness) * -0.5)) translateX(-50%);
    }

    .facet-body {
        list-style: none;
        padding: 0;
        transform: scaleY(var(--contentHeight));
        height: var(--contentHeight);
        transform-origin: top;
        transition: transform 250ms ease-in-out, height 250ms ease-in-out;
        max-height: 15rem;
        overflow-y: auto;
        position: relative;
    }

    .search {
        position: sticky;
        top: 2px;
        z-index: 10;
        input[type="search"] {
            width: calc(100% - 1rem);
            margin-inline: 0.5rem;
            padding: 0.67rem 1rem;
            border: 1px solid #ccc;
            border-radius: 10rem;
        }
    }


    .facet-item {
        transition: background-color 350ms;
        position: relative;
        display: flex;
        label {
            z-index: 1;
            padding: 0.75rem;
            pointer-events: none;
            font-size: 0.8rem;
        }
        input[type="checkbox"] {
            pointer-events: none;
        }
        .select-only {
            z-index: -1;
            opacity: 0;
            position: absolute;
            top: 50%;
            right: 1rem;
            transform: translateY(-50%);
        }
        &:hover {
            background-color: #f9f9f9;
            cursor: pointer;
            .select-only {
                z-index: 10;
                opacity: 1;
            }
        }
    }

    .facet-item + .facet-item {
        border-top: 1px solid #ccc;
    }

    .facet-footer {
        padding: 1rem;
        border-top: 1px solid #ccc;
    }


`