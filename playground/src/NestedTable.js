import React from 'react'

import {
  MLTable,
} from '@marklogic/design-system'

const payload = [
  {
      "entityName": "Order",
      "entityTypeId": "http://marklogic.com/example/Order-0.0.1/Order",
      "entityInstanceCount": 0,
      "model": {
          "info": {
              "title": "Order",
              "version": "0.0.1",
              "baseUri": "http://marklogic.com/example/"
          },
          "definitions": {
              "Order": {
                  "required": [],
                  "primaryKey": "orderId",
                  "properties": {
                      "orderId": {
                          "datatype": "string"
                      },
                      "address": {
                          "$ref": "#/definitions/Address"
                      }
                  }
              },
              "Address": {
                  "properties": {
                      "city": {
                          "datatype": "string"
                      },
                      "state": {
                          "datatype": "string"
                      }
                  }
              }
          }
      }
  },
  {
      "entityName": "abc",
      "entityTypeId": "http://example.org/abc-1.0.0/abc",
      "entityInstanceCount": 0,
      "model": {
          "info": {
              "title": "abc",
              "version": "1.0.0",
              "baseUri": "http://example.org/"
          },
          "definitions": {
              "abc": {
                  "properties": {}
              }
          }
      }
  },
  {
      "entityName": "Customer",
      "entityTypeId": "http://example.org/Customer-0.0.1/Customer",
      "entityInstanceCount": 0,
      "model": {
          "info": {
              "title": "Customer",
              "version": "0.0.1",
              "baseUri": "http://example.org/"
          },
          "definitions": {
              "Customer": {
                  "required": [
                      "name"
                  ],
                  "primaryKey": "customerId",
                  "properties": {
                      "customerId": {
                          "datatype": "integer"
                      },
                      "name": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      },
                      "shipping": {
                          "$ref": "#/definitions/Address"
                      },
                      "billing": {
                          "$ref": "#/definitions/Address"
                      },
                      "customerSince": {
                          "datatype": "date"
                      },
                      "orders": {
                          "datatype": "array",
                          "items": {
                              "$ref": "http://example.org/Order-0.0.1/Order"
                          }
                      }
                  }
              },
              "Address": {
                  "required": [],
                  "pii": [],
                  "elementRangeIndex": [],
                  "rangeIndex": [],
                  "wordLexicon": [],
                  "properties": {
                      "street": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      },
                      "city": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      },
                      "state": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      },
                      "zip": {
                          "$ref": "#/definitions/Zip"
                      }
                  }
              },
              "Zip": {
                  "required": [],
                  "properties": {
                      "fiveDigit": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      },
                      "plusFour": {
                          "datatype": "string",
                          "collation": "http://marklogic.com/collation/codepoint"
                      }
                  }
              }
          }
      }
  }
]

const definitionsParser = (definitions) => {

  let entityDefinitions = []

  for (let definition in definitions) {
    let entityDefinition = {
      name: '',
      primaryKey: '',
      elementRangeIndex: [],
      pii: [],
      rangeIndex: [],
      required: [],
      wordLexicon: [],
      properties: []
    };

    let entityProperties = [];

    entityDefinition.name = definition;

    for (let entityKeys in definitions[definition]) {
      if (entityKeys === 'properties') {
        for (let properties in definitions[definition][entityKeys]) {
          let property = {
            name: '',
            datatype: '',
            description: '',
            ref: '',
            collation: '',
            multiple: false
          }
          property.name = properties;
          property.description = definitions[definition][entityKeys][properties]['description'] || '';
          property.collation = definitions[definition][entityKeys][properties]['collation'] || '';

          if (definitions[definition][entityKeys][properties]['datatype']) {
            property.datatype = definitions[definition][entityKeys][properties]['datatype'];

            if (definitions[definition][entityKeys][properties]['datatype'] === 'array') {
              property.multiple = true;
              
              if(definitions[definition][entityKeys][properties]['items'].hasOwnProperty('$ref')) {
                // Array of Structured/Entity type
                property.datatype = definitions[definition][entityKeys][properties]['items']['$ref'].split('/').pop();
                property.ref = definitions[definition][entityKeys][properties]['items']['$ref']
              } else if (definitions[definition][entityKeys][properties]['items'].hasOwnProperty('datatype')) {
                // Array of datatype
                property.datatype = definitions[definition][entityKeys][properties]['items']['datatype']
                property.collation = definitions[definition][entityKeys][properties]['items']['collation']
              } 
            }
          } else if (definitions[definition][entityKeys][properties]['$ref']) {
            // Structured type
            property.datatype = 'structured';
            property.ref = definitions[definition][entityKeys][properties]['$ref'];
          }
          entityProperties.push(property);
        }
      } else {
        entityDefinition[entityKeys] = definitions[definition][entityKeys];
      }
      entityDefinition.properties = entityProperties;
    }
    entityDefinitions.push(entityDefinition);
  }
  return entityDefinitions;
}

const parseDefinitionsToTable = (entityDefinitionsArray, entityName) => {
  let entityTypeDefinition = entityDefinitionsArray.find( definition => definition.name === entityName);

  return entityTypeDefinition?.properties.map( (property, index) => {
    let propertyRow = {};
    if (property.datatype === 'structured') {

      const parseStructuredProperty = (entityDefinitionsArray, property) => {
        let parsedRef = property.ref.split('/');
        if (parsedRef.length > 0 && parsedRef[1] === 'definitions') {
          let structuredType = entityDefinitionsArray.find( entity => entity.name === parsedRef[2]);
          let structuredTypeProperties = structuredType?.properties.map((structProperty, structIndex) => {
            if (structProperty.datatype === 'structured') {
              // Recursion to handle nested structured types
              return parseStructuredProperty(entityDefinitionsArray, structProperty);
            } else {
              // TODO add functionality to sort, facet, delete, and add columns
              return {
                key: property.name + index + structIndex,
                propertyName: structProperty.name,
                type: structProperty.datatype === 'structured' ? structProperty.ref.split('/').pop() : structProperty.datatype,
                identifier: entityTypeDefinition?.primaryKey === structProperty.name ? structProperty.name : '',
                multiple: structProperty.multiple ? structProperty.name: '',
                advancedSearch: entityTypeDefinition?.wordLexicon.includes(structProperty.name) ? structProperty.name : '',
                pii: entityTypeDefinition?.pii.includes(structProperty.name) ? structProperty.name : ''
              }
            }
          });

          return {
            key: property.name + index,
            propertyName: property.name,
            type: property.ref.split('/').pop(),
            children: structuredTypeProperties,
            add: structuredType.name
          }
        }
      }
      propertyRow = parseStructuredProperty(entityDefinitionsArray, property)
    } else {
      // TODO add functionality to sort, facet, delete, and add columns
      propertyRow = {
        key: property.name + index,
        propertyName: property.name,
        type: property.datatype,
        identifier: entityTypeDefinition?.primaryKey === property.name ? property.name : '',
        multiple: property.multiple ? property.name : '',
        advancedSearch: entityTypeDefinition?.wordLexicon.includes(property.name) ? property.name : '',
        pii: entityTypeDefinition?.pii.includes(property.name) ? property.name : '',
        add: ''
      }
    }
    return propertyRow;
  });
}

const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    width: 400,
  },
  {
    title: 'Instances',
    dataIndex: 'instances',
    width: 100
  }
];

const innerColumns = [
  {
    title: 'Property Name',
    dataIndex: 'propertyName',
    width: 200
  },
  {
    title: 'Type',
    dataIndex: 'type',
    width: 125
  },
  {
    title: (
        <span>Identifier</span>
    ),
    dataIndex: 'identifier',
    width: 100,
  },
  {
    title: (
        <span>Multiple</span>
    ),
    dataIndex: 'multiple',
    width: 100,
  },
  {
    title: (
        <span>Sort</span>
    ),
    dataIndex: 'sort',
    width: 75,
  },
  {
    title: (
        <span>Facet</span>
    ),
    dataIndex: 'facet',
    width: 100,
  },
  {
    title: (
        <span>Advanced Search</span>
    ),
    dataIndex: 'advancedSearch',
    width: 150,
  },
  {
    title: (
        <span>PII</span>
    ),
    dataIndex: 'pii',
    width: 75
  }
];

const InnerTable = (props) => {
  let entityDefinitionsArray = definitionsParser(props.definitions);
  let renderTableData = parseDefinitionsToTable(entityDefinitionsArray, props.entityName);

  return (
    <MLTable
      columns={innerColumns}
      dataSource={renderTableData}
    />
  )
}



const expandedRowRender = (entity) => {
  return <InnerTable 
            entityName={entity.name} 
            definitions={entity.definitions}
          />
};

const NestedTable = () => {
  const renderTableData = payload.map(( entity, index) => {
    return {
      name: entity.entityName,
      instances: entity.entityName + ',' + parseInt(entity.entityInstanceCount),
      definitions: entity.model.definitions
    };
  });

  return (
    <MLTable
      columns={columns}
      dataSource={renderTableData}
      expandedRowRender={expandedRowRender}
    />
  )
}

export default NestedTable