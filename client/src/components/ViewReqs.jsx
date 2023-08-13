import { useState, useEffect } from 'react'
import axios from 'axios'
import InboundReq from './InboundReq.jsx'
import OutboundReq from './OutboundReq.jsx'
import { IconContext } from 'react-icons';
import { AiOutlineRollback } from 'react-icons/ai'

const userAxios = axios.create();

userAxios.interceptors.request.use(config => {
    const token = localStorage.getItem("token");
    config.headers.Authorization = `Bearer ${token}`;
    return config;
})

export default function ViewReqs ({updateToggle}) {

    const [inboundReqInfos, setInboundReqInfos] = useState(null);
    const [outboundReqInfos, setOutboundReqInfos] = useState(null);

    const action = () => () => updateToggle(0);

    const acceptRequest = async (request) => {
        try {
            const acceptRes = await userAxios.post('/api/protected/friends/add', {
                friendId: request.sender
            })
            const removeRes = await userAxios.delete('/api/protected/friends/request', { data: request});
            const removeIndex = inboundReqInfos.findIndex(reqInfo => reqInfo.request === request);
                setInboundReqInfos(prev => prev.toSpliced(removeIndex, 1))
        } catch (err) {
            console.log(err)
        }
    }

    const removeRequest = async (request, direction) => {
        try {
            const removeRes = await userAxios.delete('/api/protected/friends/request', { data: request});
            if (direction === 'outbound') {
                const removeIndex = outboundReqInfos.findIndex(reqInfo => reqInfo.request === request);
                setOutboundReqInfos(prev => prev.toSpliced(removeIndex, 1))
            } else {
                const removeIndex = inboundReqInfos.findIndex(reqInfo => reqInfo.request === request);
                setInboundReqInfos(prev => prev.toSpliced(removeIndex, 1))
            }

        } catch (err) {
            console.log(err)
        }
    }

    const inboundDesignator = () => {
        if (inboundReqInfos === null) {
            return (
                <div className="loading-placeholder">
                    Loading...
                </div>
            )
        } else if (inboundReqInfos.length === 0) {
            return (
                <div className="loading-placeholder">
                    You have no inbound requests.
                </div>
            )
            
        } else {
            return inboundReqInfos.map(requestInfo => <InboundReq key={requestInfo.sender._id} requestInfo={requestInfo} removeRequest={removeRequest} acceptRequest={acceptRequest}/>)
        }
    }

    const outboundDesignator = () => {
        if (outboundReqInfos === null) {
            return (
                <div className="loading-placeholder">
                    Loading...
                </div>
            )
        } else if (outboundReqInfos.length === 0) {
            return (
                <div className="loading-placeholder">
                    You have no outbound requests.
                </div>
            )
            
        } else {
            return outboundReqInfos.map(requestInfo => <OutboundReq key={requestInfo.receiver._id} requestInfo={requestInfo} removeRequest={removeRequest}/>)
        }
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const userId = JSON.parse(localStorage.getItem('staticUserInfo'))._id;
                let inbound = [];
                let outbound = [];
                const fluidUserInfoRes = await userAxios.get('/api/protected/users')
                const usersRes = await userAxios.get('/api/protected/users/all')
                fluidUserInfoRes.data.requests.forEach(request => {
                    if (request.sender === userId) {
                        const receiver = usersRes.data.find(user => user._id === request.receiver)
                        outbound.push({
                            receiver,
                            request
                        })
                    } else {
                        const sender = usersRes.data.find(user => user._id === request.sender)
                        inbound.push({
                            sender,
                            request
                        })
                    }
                })
                setOutboundReqInfos(outbound)
                setInboundReqInfos(inbound)
            } catch (err) {
                console.log(err)
            } 
        }
        fetchData()
    }, [])

    return (
        <div className="reqs-wrapper">
            <div className="go-back" onClick={action()}>
                <IconContext.Provider value={{
                        className: `nav-icons`
                    }}>
                        <AiOutlineRollback />
                </IconContext.Provider>
            </div>
            <div className="inbound">
                Inbound Friend Requests
            </div>
            {inboundDesignator()}
            <div className="outbound">
                Outbound Friend Requests
            </div>
            {outboundDesignator()}
        </div>
    )
}