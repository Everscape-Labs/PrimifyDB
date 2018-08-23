'use strict';

var body = {
  type: "object",
  properties: {
    table: {
      type: 'String'
    },
    fields: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          name: {
            type: 'String'
          },
          type: {
            type: 'String',
            enum: ['String', 'Number', "Date"]
          }
        }
      }
    }
  },
  required: ['table', 'fields']
};

var params = {
  type: "object",
  properties: {
    database: {
      type: 'String'
    }
  },
  required: ['database']
};

module.exports = {
  body: body,
  params: params
};