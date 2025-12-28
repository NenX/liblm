import { mchcLogger } from '@lm_fe/env';
import { message } from 'antd';
import { get, map, set } from 'lodash';



export function createFormHandler(config, { submitChange }) {
  let formData = {};
  let newRef = {};

  let fieldsValueChange = () => { };

  if (!Array.isArray(config)) {
    message.warning(`expect array but ${typeof config}`)
    console.log(`expect array but `, config)
    config = []

    // throw new Error(`expect array but ${typeof config}`);
  }
  /**
   * @param {string} fieldName
   * @param {string} eventName
   * @param {function} cb
   * fieldName:{
   *   eventName:cb
   * }
   */

  const eventCallBacks = {};
  const formState = {
    validateCode: false,
    submitChange,
  };

  // c - config
  const initField = function (config) {
    let result = {};
    map(config, (itemConfig) => {
      set(result, get(itemConfig, 'name'), { actions: {} });
    });
    return result;
  };

  const updateFormData = function () {
    Object.keys(formHandler).forEach((key) => {
      if (formHandler[key].actions) {
        if (typeof formHandler[key].actions.getValue === 'function') {
          formData = Object.assign(formData, { [key]: formHandler[key].actions.getValue() });
        }
      }
    });
  };

  const submit = function () {
    const keys = Object.keys(formHandler)
    mchcLogger.log('formHandler submit', { formHandler, keys })
    let validCode = true;
    keys.forEach((key) => {
      if (formHandler[key].actions) {
        if (typeof formHandler[key].actions.getValue === 'function') {
          formData = Object.assign(formData, { [key]: formHandler[key].actions.getValue() });
        }
        if (typeof formHandler[key].actions.valid === 'function') {
          const result = formHandler[key].actions.valid();
          if (!result && validCode) {
            validCode = false;
          }
        }
      }
    });
    return new Promise((resolve) => {
      resolve({ validCode, res: formData });
    });
  };

  const reset = function () {
    Object.keys(formHandler).forEach((key) => {
      if (formHandler[key].actions) {
        if (formHandler[key].actions.reset) {
          formHandler[key].actions.reset();
        }
      }
    });
  };

  // TODO 所有的valid方法需要整改
  const valid = function () {
    let validCode = true;
    const keyArr = Object.keys(formHandler);
    for (let i = 0; i < keyArr.length; i++) {
      if (formHandler[keyArr[i]].actions && typeof formHandler[keyArr[i]].actions.valid === 'function') {
        if (!formHandler[keyArr[i]].actions.valid()) {
          validCode = false;
          break;
        }
      }
    }
    return validCode;
  };

  const subscribe = function (fieldName, eventName, cb) {
    // if(fieldName in this || fieldName === "_global"){
    // 这里使用this会导致subscribe传给组件后this丢失
    if (fieldName in formHandler || fieldName === '_global') {
      if (!eventCallBacks[fieldName]) {
        eventCallBacks[fieldName] = {};
      }
      if (!eventCallBacks[fieldName][eventName]) {
        eventCallBacks[fieldName][eventName] = [];
      }
      let flag = true;
      for (const event of eventCallBacks[fieldName][eventName]) {
        // 判断传入的函数是否已存在
        if (JSON.stringify(cb) === JSON.stringify(event)) {
          flag = false;
          break;
        }
      }
      if (flag) {
        eventCallBacks[fieldName][eventName].push(cb);
      }
    }
  };

  const dispatch = function (fieldName, eventName, args) {
    formHandler.fieldChange = true;
    updateFormData && updateFormData();
    fieldsValueChange && fieldsValueChange(formData);
    if (fieldName !== '_global' && submitChange) {
      dispatch('_global', 'change');
      // return;
    }
    if (!Object.prototype.hasOwnProperty.call(eventCallBacks, fieldName)) {
      // console.warn(`fieldName ${fieldName} not found in eventCallBacks Object`);
      return;
    }
    const eventObject = eventCallBacks[fieldName];
    const eventQueue = eventObject[eventName];
    if (!eventQueue || eventQueue.length === 0) {
      // console.warn(`fieldName ${eventName} not found in ${fieldName} Event Object || eventQueue's length is 0`);
      return;
    }

    setTimeout(() => {
      eventQueue.forEach((func) => {
        func(args);
      });
    }, 100);
  };
  const setMyRef = function (fieldName, ref) {
    // set(formHandler, `ref.${fieldName}`, ref);
    newRef[`${fieldName}`] = ref;
  };
  const getMyRef = function (fieldName) {
    return get(formHandler, `ref.${fieldName}`);
  };
  const getAllRef = function () {
    return get(formHandler, `ref`);
  };

  const cleanSubscriptions = function () {
    formHandler.eventCallBacks = {};
  };

  const listenFormData = function (callback) {
    fieldsValueChange = callback;
  };

  const formHandler = { ...initField(config) };
  formHandler.submit = submit;
  formHandler.valid = valid;
  formHandler.reset = reset;
  formHandler.subscribe = subscribe;
  formHandler.dispatch = dispatch;
  formHandler.cleanSubscriptions = cleanSubscriptions;
  formHandler.formState = formState;
  formHandler.formData = formData;
  formHandler.listenFormData = listenFormData;
  formHandler.uuid = Math.random();
  formHandler.fieldChange = false; // 判断表单是否有修改
  formHandler.setMyRef = setMyRef;
  formHandler.getMyRef = getMyRef;
  formHandler.getAllRef = getAllRef;
  formHandler.ref = newRef;
  return formHandler;
}
