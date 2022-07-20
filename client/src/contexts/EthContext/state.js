const actions = {
  init: "INIT",
};

const initialState = {
  loaded: false,
  artifact: null,
  web3: null,
  accounts: null,
  networkID: null,
  contract: null,
  tokenInstance: null, kycInstance: null , myTokenSaleInstance: null, kycAddress:'', tokenSaleAddress:''
};

const reducer = (state, action) => {
  const { type, data } = action;
  switch (type) {
    case actions.init:
      return { ...state, ...data };
    default:
      throw new Error("Undefined reducer action type");
  }
};

export {
  actions,
  initialState,
  reducer
};
