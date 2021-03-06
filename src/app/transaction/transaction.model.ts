
export interface ITransaction {
  _id?: string;
  orderId?: string;
  fromId?: string;
  fromName?: string;
  toId?: string;
  toName?: string;
  // type?: string;
  actionCode: string;
  amount: number;
  fromBalance?: number;
  toBalance?: number;
  note?: string;
  created?: Date;
  modified?: Date;
}

export interface ITransactionData {
  date: Date;
  received: number;
  paid: number;
  balance: number;
  type: string; // credit is from, debit is to
  id?: string;
  name?: string;
}


export const TransactionAction = {
  PAY_DRIVER_CASH: { code: 'PDCH', name: 'client pay driver cash' }, // 'client pay cash', 'pay cash'
  PAY_BY_CARD: { code: 'PC', name: 'client pay by card' }, // 'pay by card'
  PAY_BY_WECHAT: { code: 'PW', name: 'client pay by wechat' }, // 'pay by wechat'

  PAY_MERCHANT_CASH: { code: 'PMCH', name: 'driver pay merchant cash' }, // pay merchant
  PAY_MERCHANT_BY_CARD: { code: 'PMC', name: 'driver pay merchant by card' }, // pay merchant by card
  PAY_MERCHANT_BY_WECHAT: { code: 'PMW', name: 'driver pay merchant by wechat' }, // pay merchant by wechat

  PAY_SALARY: { code: 'PS', name: 'pay salary' },
  PAY_OFFICE_RENT: { code: 'POR', name: 'pay office rent' },

  ORDER_FROM_MERCHANT: { code: 'OFM', name: 'duocun order from merchant' },
  ORDER_FROM_DUOCUN: { code: 'OFD', name: 'client order from duocun' },
  CANCEL_ORDER_FROM_MERCHANT: { code: 'CFM', name: 'duocun cancel order from merchant' },
  CANCEL_ORDER_FROM_DUOCUN: { code: 'CFD', name: 'client cancel order from duocun' },

  REFUND_EXPENSE: { code: 'RE', name: 'refund expense' }, // note is orderId
  REFUND_CLIENT: { code: 'RC', name: 'refund client' },
  ADD_CREDIT_BY_CARD: { code: 'ACC', name: 'client add credit by card' },
  ADD_CREDIT_BY_WECHAT: { code: 'ACW', name: 'client add credit by WECHATPAY' },
  ADD_CREDIT_BY_CASH: { code: 'ACCH', name: 'client add credit by cash' },
  TRANSFER: { code: 'T', name: 'transfer' },
  BUY_MATERIAL: { code: 'BM', name: 'buy material' }, // buy drinks
  BUY_EQUIPMENT: { code: 'BE', name: 'buy equipment' },
  BUY_ADVERTISEMENT: { code: 'BA', name: 'buy advertisement' },
  OTHER_EXPENSE: { code: 'OE', name: 'other expense' },
  TEST: { code: 'TEST', name: 'test' }
};
