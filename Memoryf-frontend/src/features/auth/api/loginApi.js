import axios from 'axios'

const url = "http://localhost:8006/memoryf/login"
const method = "post"

const loginMemberApi = async(memberId, memberPwd) => {

    try {
        const response = await axios({
            url,
            method,
            data : {memberId, memberPwd},
            headers : {"Content-Type" : "application/json"}
        })

        // JWT 토큰만 리턴
        return response.data;

    } catch(error) {

        console.log("로그인 ajax 통신 실패", error)

        return null

    }

}

// 로그인 axios 로그인폼으로 export
export default loginMemberApi