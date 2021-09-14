export namespace DB {
  export namespace User {
    /**
     * Columns in user.data table
     * Store users' basic information
     *
     * @export
     * @interface Data
     */
    export interface Data {
      id: number;
      email: string;
      fname: string;
      lname: string;
      created_at: string;
      updated_at: string;
      created_by?: number;
    }

    /**
     * Columns in user.auth table
     * Store users username and password combinations
     *
     * @export
     * @interface Auth
     */
    export interface Auth {
      id: number;
      username: string;
      pwd: string;
    }

    /**
     * Columns in user.tokens table
     * Store users' jwt refresh tokens
     *
     * @export
     * @interface Tokens
     */
    export interface Tokens {
      id: number;
      token: string;
      expires: string;
      blacklisted: boolean;
    }
  }

  export namespace Patient {
    /**
     * Basic info of patients
     *
     * @export
     * @interface Data
     */
    export interface Data {
      id: number;
      fname: string;
      lname: string;
      gender: string;
      dob: {
        d: number;
        m: number;
        y: number;
      };
      address: string;
      email: string;
      tp: string;
      admission: {
        d: number;
        m: number;
        y: number;
        dic: string;
      };
      created_by: number;
      created_at: string;
    }
  }

  export interface Encrypted {
    id: number;
    data: string;
    created_at: string;
  }
}
