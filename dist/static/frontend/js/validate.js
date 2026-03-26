"use strict";

define(['lib/validator', 'jquery', 'zui'], function (Schema) {
  function useValidator(descriptor) {
    const validator = new Schema(descriptor);
    function validate(target) {
      return new Promise((resolve, reject) => {
        validator.validate(target, (errors, fields) => {
          if (errors) {
            const [error] = errors;
            new $.zui.Messager(error.message, {
              type: 'danger',
              close: false
            }).show();
            reject(error);
          } else {
            resolve(true);
          }
        });
      });
    }
    return validate;
  }
  return {
    useValidator,
    Schema
  };
});