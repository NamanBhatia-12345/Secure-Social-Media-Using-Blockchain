import Navbar from "./Navbar";
import NFTTile from "./NFTTile";
import MarketplaceJSON from "../Marketplace.json";
import axios from "axios";
import { useState } from "react";
import { GetIpfsUrlFromPinata } from "../utils";

export default function Marketplace() {
const sampleData = [
    {
        "name": "Linked in",
        "image":"https://gateway.pinata.cloud/ipfs/Qmc9BVY4WNfxMRaN6CbX4bWo5oGof9XSCpWBHqnyDwTL6E?_gl=1*17zcn1r*rs_ga*N2FjYzZjZDYtNTIzMy00MGM1LTljNzEtYmQ1YjM1Njg2MzEw*rs_ga_5RMPXG14TE*MTY4NDA2ODA2OC41LjEuMTY4NDA2ODEwNC4yNC4wLjA.",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757CB4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Instagram",
        "image":"https://gateway.pinata.cloud/ipfs/QmeC41UdfvxX4zi7pxkHBnmBYVrciuhXB7ecjFrYeEMMuf?_gl=1*thl5mz*rs_ga*N2FjYzZjZDYtNTIzMy00MGM1LTljNzEtYmQ1YjM1Njg2MzEw*rs_ga_5RMPXG14TE*MTY4NDA2ODA2OC41LjEuMTY4NDA2ODgxMS40Ny4wLjA.",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
    {
        "name": "Facebook",
        "image":"https://gateway.pinata.cloud/ipfs/QmSAGwxqLDxs2MTAQnUMaqtecMTVHuKpgkcC2PBAUTmNbU?_gl=1*1vzhha4*rs_ga*N2FjYzZjZDYtNTIzMy00MGM1LTljNzEtYmQ1YjM1Njg2MzEw*rs_ga_5RMPXG14TE*MTY4NDA2ODA2OC41LjEuMTY4NDA2ODgxMS40Ny4wLjA.",
        "price":"0.03ETH",
        "currentlySelling":"True",
        "address":"0xe81Bf5A757C4f7F82a2F23b1e59bE45c33c5b13",
    },
];
const [data, updateData] = useState(sampleData);
const [dataFetched, updateFetched] = useState(false);

async function getAllNFTs() {
    const ethers = require("ethers");
    //After adding your Hardhat network to your metamask, this code will get providers and signers
    const provider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = provider.getSigner();
    //Pull the deployed contract instance
    let contract = new ethers.Contract(MarketplaceJSON.address, MarketplaceJSON.abi, signer)
    //create an NFT Token
    let transaction = await contract.getAllNFTs()

    //Fetch all the details of every NFT from the contract and display
    const items = await Promise.all(transaction.map(async i => {
        var tokenURI = await contract.tokenURI(i.tokenId);
        console.log("getting this tokenUri", tokenURI);
        tokenURI = GetIpfsUrlFromPinata(tokenURI);
        let meta = await axios.get(tokenURI);
        meta = meta.data;

        let price = ethers.utils.formatUnits(i.price.toString(), 'ether');
        let item = {
            price,
            tokenId: i.tokenId.toNumber(),
            seller: i.seller,
            owner: i.owner,
            image: meta.image,
            name: meta.name,
            description: meta.description,
        }
        return item;
    }))

    updateFetched(true);
    updateData(items);
}

if(!dataFetched)
    getAllNFTs();

return (
    <div>
        <Navbar></Navbar>
        <div className="flex flex-col place-items-center mt-20">
            <div className="md:text-xl font-bold text-white">
                NFT Artifacts
            </div>
            <div className="flex mt-5 justify-between flex-wrap max-w-screen-xl text-center">
                {data.map((value, index) => {
                    return <NFTTile data={value} key={index}></NFTTile>;
                })}
            </div>
        </div>            
    </div>
);

}