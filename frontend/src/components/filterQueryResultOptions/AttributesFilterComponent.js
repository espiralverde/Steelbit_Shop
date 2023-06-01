import { Form } from "react-bootstrap";

const AttributesFilterComponent = ({attrsFilter, setAttrsFromFilter}) => {
  //console.log(attrsFilter)
  return (
    <>
    {attrsFilter && attrsFilter.length > 0 && attrsFilter.map((filter, idx) => (
        <div key={idx} className="mb-3">
          <Form.Label>{filter.key}</Form.Label>
          
          {filter.value.map((valueForKey, idx2) => (
            <Form.Check key={idx2} type="checkbox" id="default-checkbox" label={valueForKey} onChange={e => {
              setAttrsFromFilter(filters => {
                if (filters.length === 0 ) {
                  return [{key: filter.key, values: [valueForKey]}]
                }
                let index = filters.findIndex((item) => item.key === filter.key)

                if (index === -1) {
                  return [...filters, {key: filter.key, values: [valueForKey]}]
                  //con esto le digo que si la opción elegida no está dentro de lo del filtro (el -1), devuelve lo anterior (cuando está unchecked)
                }
                //ahora, si está la opción elegida (checked)
                if (e.target.checked) {
                  filters[index].values.push(valueForKey)
                  let unique = [...new Set(filters[index].values)]
                  filters[index].values = unique
                  return[...filters]                  
                }
                // si está dentro del filtro y no checkeada
                let valuesWithoutUnChecked = filters[index].values.filter((val) => val !== valueForKey)
                filters[index].values = valuesWithoutUnChecked
                if (valuesWithoutUnChecked.length > 0 ){
                  return [...filters]
                } else {
                  let filtersWithoutOneKey = filters.filter((item) => item.key !== filter.key)
                  return [...filtersWithoutOneKey]

                }
              })
            }}/>
          ))}
        </div>
    ))}

      
    </>
  );
};

export default AttributesFilterComponent;
