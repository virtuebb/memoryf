import api from "./axios";

const findIdApi = (memberName, email) => {

    return api.post(
        
        "/find/id",
        {memberName, email}
        );
}

export default findIdApi