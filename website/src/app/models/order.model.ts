export interface Order {
  _id: string;
  orderDetails: {
    create_time: string;
    id: string;
    payer: {
      address: {
        country_code: string;
      };
      email_address: string;
      name: {
        given_name: string;
        surname: string;
      };
      payer_id: string;
    };
    purchase_units: [
      {
        amount: {
          value: string;
          currency_code: string;
        };
        payee: {
          email_address: string;
          merchant_id: string;
        };
        shipping: {
          address: {
            address_line_1: string;
            address_line_2: string;
            admin_area_1: string;
            admin_area_2: string;
            country_code: string;
            postal_code: string;
          },
          name: {
            full_name: string
          }
        };
      }
    ]
  };
  products: [
    {
      quantity: number,
      size: string,
      _id: string,
      product: {
        _id: string,
        amount: number,
        category: string,
        description: string,
        imageUrls: [],
        title: string,
        userId: string
      }
    }
  ];
  user: {
    name: string,
    userId: string
  };
}
