import React from "react";
import { drizzleReactHooks } from "@drizzle/react-plugin";
import { newContextComponents } from "@drizzle/react-components";
import KittyList from './KittyList.js';

const { useDrizzle, useDrizzleState } = drizzleReactHooks;
const { ContractData } = newContextComponents;


//step 1: fetch base uri
//step 2: get list of kitties, baseuri + id


export default () => {
  const { drizzle } = useDrizzle();
  const state = useDrizzleState(state => state);

  return (
    <div>
      <div>
        <h2>Catalogue</h2>
        <ContractData
          drizzle={drizzle}
          drizzleState={state}
          contract="Cryptokitty"
          method="tokenURIBase"
          render={uriBase => {
            return(
              <ContractData
                drizzle={drizzle}
                drizzleState={state}
                contract="Cryptokitty"
                method="getAllKitties"
                render={kitties => (
                  <KittyList
                    kitties={kitties}
                    uriBase = {uriBase}
                  />
                )}
                />
            )
          }}
        />
      </div>
    </div>
  );
};
