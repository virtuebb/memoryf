import api from "./axios";

const checkNickApi = async(memberNick) => {

    try {

        const response = await api.post(
            "/signup/check-nick",
            memberNick,
            {headers : {"Content-Type" : "text/plain"}}
        )

        return response.data;

    } catch(error) {

        console.log("닉네임 중복확인 실패", error);

        return null;
    }

}

export default checkNickApi