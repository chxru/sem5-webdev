declare namespace API {
    /**
     * Return type when the backend successfully executed the
     * username & password checking (no matter password is
     * correct or incorrect)
     *
     * @export
     * @interface LoginResponse
     */
    export interface LoginResponse {
        success: boolean;
        access?: string;
        refresh?: string;
        err?: string;
    }
}
