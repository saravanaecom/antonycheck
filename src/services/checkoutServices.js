import APIRoutes from '../routes/APIRoutes';
import {ServerURL} from '../server/serverUrl';

// Insert My order
export const API_InsertSaleOrderSave = async (objlist) => {
    console.log('API_InsertSaleOrderSave request payload:', objlist);
    try {
      const response = await fetch(`${APIRoutes.INSERT_SALE_ORDER_SAVE}`, {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          objData: ''
        },
        body: JSON.stringify(objlist)
      });

      console.log('API_InsertSaleOrderSave response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('API_InsertSaleOrderSave response data:', data);
        return data;
      } else {
        // try to get response text for debugging
        let text = '';
        try { text = await response.text(); } catch (e) { text = '<unable to read response text>'; }
        console.error(`API_InsertSaleOrderSave failed: ${response.status} ${response.statusText}`, text);
        throw new Error(`InsertSaleOrderSave failed: ${response.status} ${response.statusText} - ${text}`);
      }
    } catch (error) {
      console.error('Failed to insert sale order:', error);
      throw error; // Re-throw so the calling function can handle it
    }
  };

  //Minimum order amount chek
  export const API_FetchMinimumOrderAmount = async () => {
    let objData = "";
    let objlist = {
        Comid: ServerURL.COMPANY_REF_ID,
    };
    try {
        const response = await fetch(`${APIRoutes.GET_MINIMUM_ORDER_AMOUNT}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json; charset=utf-8',
                objData: objData,
            },
            body: JSON.stringify(objlist)
        });
        if (!response.ok) {
            throw new Error('Network response was not ok.');
        }
        const data = await response.json();
        if (!data.data || !Array.isArray(data.data)) {
            throw new Error('No data found.');
        }
        return data;
    } catch (error) {
        console.error('Failed to fetch details:', error);
        throw error; // Re-throw so the calling function can handle it
    }
};
