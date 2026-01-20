import axios from "axios";
import { create } from "zustand";


interface TailscaleDevice {
    addresses: string[];
    id: string;
    nodeId: string;
    user: string;
    name: string;
    hostname: string;
    clientVersion: string;
    updateAvailable: boolean;
    os: string;
    created: string;
    connectedToControl: boolean;
    lastSeen: string;
    expires: string;
    keyExpiryDisabled: boolean;
    authorized: boolean;
    isExternal: boolean;
    machineKey: string;
    nodeKey: string;
    tailnetLockKey: string;
    blocksIncomingConnections: boolean;
    tailnetLockError: string;
}


interface TailscaleDeviceResponse {
    devices: TailscaleDevice[];
}

interface TailscaleStore {
    devices: TailscaleDevice[];
}

export const useTailScaleStore = create<TailscaleStore>((set) => ({
    devices: [],
}));

// {
//     "devices": [
//         {
//             "addresses": [
//                 "100.110.196.74",
//                 "fd7a:115c:a1e0::1233:c44a"
//             ],
//             "id": "5182256573554104",
//             "nodeId": "nDurbN64Uh11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "gateway.tail82c7eb.ts.net",
//             "hostname": "gateway",
//             "clientVersion": "1.92.3-ta17f36b9b-ga4dc88aac",
//             "updateAvailable": true,
//             "os": "linux",
//             "created": "2026-01-01T04:30:23Z",
//             "connectedToControl": false,
//             "lastSeen": "2026-01-01T14:16:20Z",
//             "expires": "2026-06-30T04:30:23Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:e5a56f5300d81e4a4f936513fe74c562f2718bfac008be8b0e491cf9c8323e11",
//             "nodeKey": "nodekey:22eb761de25c6b72b1e8144b053fae2a6de57ac2fa836cdae4a4bfa312eec449",
//             "tailnetLockKey": "nlpub:1139e8e3a9f0eaa4087f47ac1886f7df39c2a3c2c8da9f3b230541940dc73ab0",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.64.3.1",
//                 "fd7a:115c:a1e0::1933:7c6c"
//             ],
//             "id": "313948187596000",
//             "nodeId": "nwgpGRtBT311CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "gatewaynas.tail82c7eb.ts.net",
//             "hostname": "gatewaynas",
//             "clientVersion": "1.92.5-t1c215f6e5-g9b792287b",
//             "updateAvailable": false,
//             "os": "linux",
//             "created": "2026-01-11T07:57:28Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-07-10T07:57:28Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:cb5e587464634648dad51581c3e5266afce4a8cab1d40717dd6fb0876246b578",
//             "nodeKey": "nodekey:1f04ffb3672483a7420fa70f7e6184d113e66813ff4bc8134418449f19997c6b",
//             "tailnetLockKey": "nlpub:8b6b4b840fa68ac60c5632a7c8f05481e67443b53dd8bad1ac290897e9f149d0",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.106.175.92",
//                 "fd7a:115c:a1e0::9533:af5c"
//             ],
//             "id": "2449326403159980",
//             "nodeId": "no2YvmeJ8L11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "ip-172-26-6-70.tail82c7eb.ts.net",
//             "hostname": "ip-172-26-6-70",
//             "clientVersion": "1.92.5-t1c215f6e5-g9b792287b",
//             "updateAvailable": false,
//             "os": "linux",
//             "created": "2026-01-08T14:55:43Z",
//             "connectedToControl": false,
//             "lastSeen": "2026-01-09T05:25:01Z",
//             "expires": "2026-07-07T14:55:43Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:891be9b2a001a4ff123af17dc8e1168bc6c417316e894824c8acaa415a5ac62b",
//             "nodeKey": "nodekey:3dcc8c3a7bc1837ddf7c0d01abb025ccb79a15e2f5b40ef9e07847f995eaaf5b",
//             "tailnetLockKey": "nlpub:1d55a42e7fdb343b640e68f736fafc7a00c02f84e3d1435df7017deb964effc3",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.64.22.33",
//                 "fd7a:115c:a1e0::3101:3e83"
//             ],
//             "id": "1425385325709222",
//             "nodeId": "n7MMERTZ8C11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "iphone171.tail82c7eb.ts.net",
//             "hostname": "localhost",
//             "clientVersion": "1.92.3-ta17f36b9b-ga4dc88aac",
//             "updateAvailable": false,
//             "os": "iOS",
//             "created": "2025-10-06T05:59:21Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-04-04T05:59:21Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:2d3b161ae18b2d45406f7d5f7d9a33561f8ee0d910d11313d6830d9624b60654",
//             "nodeKey": "nodekey:d8dafadcc73408c7ff6fd8ee656921de28247b6f1efb467922e28964314a3e71",
//             "tailnetLockKey": "nlpub:0940eed8ad7d6169fcc4092ac4f56a5def8467d59bdaa1ecf434a9e925ddc8e7",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.89.97.57",
//                 "fd7a:115c:a1e0::9b33:6139"
//             ],
//             "id": "5481362625881166",
//             "nodeId": "nwMsCt6Xoj11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "linuxbackend.tail82c7eb.ts.net",
//             "hostname": "linuxbackend",
//             "clientVersion": "1.92.3-ta17f36b9b-ga4dc88aac",
//             "updateAvailable": true,
//             "os": "linux",
//             "created": "2026-01-01T04:36:43Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-06-30T04:36:43Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:21c7cd5deb8325c4cdb2859bd7858bf14ae8fb45d45bc9de3df8d8d316038e49",
//             "nodeKey": "nodekey:718cd1d75c938eada1dc77e2673e8ff0951fdd0845ed7851aff19f529b596138",
//             "tailnetLockKey": "nlpub:19364fa61567fa001e09d9b09862cd39e6c52298c93d1e725f166b45f8a8bf21",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.64.22.17",
//                 "fd7a:115c:a1e0::d301:dd7b"
//             ],
//             "id": "4010187342031632",
//             "nodeId": "nu56BepDKY11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "macduylong.tail82c7eb.ts.net",
//             "hostname": "MacDuyLong",
//             "clientVersion": "1.92.3-ta17f36b9b-ga4dc88aac",
//             "updateAvailable": false,
//             "os": "macOS",
//             "created": "2025-10-06T13:40:29Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-04-04T13:40:29Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:6e70eee9cdf03e9382a3f4355782cfd25cd9041392147edc9be4ee4055be746c",
//             "nodeKey": "nodekey:f920e6637dfadd6434a78ceb1bbc9252214dad5d21b4311ee347f6b4d3d6dd77",
//             "tailnetLockKey": "nlpub:40aa780b49e4288a9d5086f4e121c209f8a3d7d44f413bdf575d2e779da53365",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.64.22.22",
//                 "fd7a:115c:a1e0::3c33:ec6b"
//             ],
//             "id": "597682182898985",
//             "nodeId": "nJKWqe6hf511CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "opnsense.tail82c7eb.ts.net",
//             "hostname": "OPNsense",
//             "clientVersion": "1.92.2",
//             "updateAvailable": false,
//             "os": "freebsd",
//             "created": "2025-12-10T12:17:56Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-06-08T12:17:56Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:39c28e803e717dffe8324c0175fa2b3dcfe1918630b7ac14456fdf69a5ceb604",
//             "nodeKey": "nodekey:8decac37296f3a4f4cd178ef708625799bd41be008a0a609c7c22ca33c1aec6a",
//             "tailnetLockKey": "nlpub:608f49a7e9ce8c095f9ce3f662636111708f36131b20361167d09fde8ffa6bfb",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.64.22.2",
//                 "fd7a:115c:a1e0::e533:7270"
//             ],
//             "id": "5686506873397495",
//             "nodeId": "nEihsntRQm11CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "truenas-scale.tail82c7eb.ts.net",
//             "hostname": "truenas-scale",
//             "clientVersion": "1.92.5-tb1eb1a05c",
//             "updateAvailable": false,
//             "os": "linux",
//             "created": "2025-12-15T15:32:24Z",
//             "connectedToControl": true,
//             "lastSeen": "2026-01-13T15:54:39Z",
//             "expires": "2026-06-13T15:32:24Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:10b472a862bd1c8f26d682233c0f3f893d3186aafee2a5cc55563f0b4575d836",
//             "nodeKey": "nodekey:0c49ed2add8a5d331f7c684ccdc77b8aa9c8c6f2163aff63ab87b351e506726f",
//             "tailnetLockKey": "nlpub:22029816680dcc440183096c92c0f0d251098f1694c4af390172b9c8f467aad3",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         },
//         {
//             "addresses": [
//                 "100.89.204.12",
//                 "fd7a:115c:a1e0::1733:cc0c"
//             ],
//             "id": "8782415417042939",
//             "nodeId": "naaFSKAaaB21CNTRL",
//             "user": "duylongmind432001@gmail.com",
//             "name": "ubuntu-s-1vcpu-1gb-nyc3-01.tail82c7eb.ts.net",
//             "hostname": "ubuntu-s-1vcpu-1gb-nyc3-01",
//             "clientVersion": "1.88.4-t85f4267ee",
//             "updateAvailable": true,
//             "os": "linux",
//             "created": "2026-01-01T14:35:14Z",
//             "connectedToControl": false,
//             "lastSeen": "2026-01-13T00:37:42Z",
//             "expires": "2026-06-30T14:35:14Z",
//             "keyExpiryDisabled": false,
//             "authorized": true,
//             "isExternal": false,
//             "machineKey": "mkey:b175aa7e880c85c2a7fa36fdccc9ec8a27502156edc2d79affdc7a5709f6dc79",
//             "nodeKey": "nodekey:84544565ec220772d3dce957eb07620e5762b835818acfb492b5bba21799cc0b",
//             "tailnetLockKey": "nlpub:edf73df64d9a98b38b474645ac1952850ecc2081b14d46e5de65a81f6153e95b",
//             "blocksIncomingConnections": false,
//             "tailnetLockError": ""
//         }
//     ]
// }