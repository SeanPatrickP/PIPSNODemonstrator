import { useReducer } from "react";

export function changeHandlerBasic(dispatch, path, fieldName, newValue) {
  dispatch({
    type: "update",
    value: newValue,
    path: [...path, fieldName],
  });
}

export function followPath(o, p) {
  let subo = o;
  while (p.length > 1) {
    let used;
    [used, ...p] = p;
    subo = subo[used];
  }
  return [subo, p[0]];
}

export function reducer(objState, action) {
  switch (action.type) {
    case "update": {
      let newState = { ...objState };
      let p = [...action.path];
      const [parentCt, fieldName] = followPath(newState, p);
      parentCt[fieldName] = action.value;
      console.log(newState);
      return newState;
    }
    case "delete": {
      let newState = { ...objState };
      let p = [...action.path];
      const [parentCt, fieldName] = followPath(newState, p);
      delete parentCt[fieldName];
      console.log(newState);
      return newState;
    }
    case "ct": {
      let newState = { ...objState };
      let p = [...action.path];
      const [parentCt, fieldName] = followPath(newState, p);
      const ct = parentCt[fieldName];
      if (!ct) {
        parentCt[fieldName] = { type: action.ct };
      } else {
        ct.__type = action.ct;
      }
      console.log(newState);
      return newState;
    }
    case "new":
      console.log(action.value);
      return action.value;
  }
}

export default function useDeepObject(obj) {
  return useReducer(reducer, obj);
}
