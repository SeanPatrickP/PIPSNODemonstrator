import React, { useEffect, useState } from "react";
import { POST, SUCCESS } from "./constants";

export const useStringChoices = function (ct, path, fields, setter) {
  const [choices, setChoices] = useState({});

  useEffect(() => {
    let isMounted = true;

    if (fields && fields.length) {
      fetch("/api/contract-terms-editor/string-choices", {
        method: POST,
        body: JSON.stringify({ ct, path, fields }),
      })
        .then(
          (response) => (response.ok && response.json()) || Promise.reject()
        )
        .then((response) => {
          if (isMounted) {
            setChoices(response);
          }
          if (
            setter &&
            response.status &&
            response.status.toLowerCase() === SUCCESS
          ) {
            setter(response);
          }
        });
    } else {
      setChoices({});
    }

    return () => {
      isMounted = false;
    };
  }, []);

  return choices;
};

const StringChoicesContext = React.createContext(undefined);

export default StringChoicesContext;
