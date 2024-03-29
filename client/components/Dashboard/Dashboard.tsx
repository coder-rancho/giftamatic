import { PlusCircleOutlined } from "@ant-design/icons"
import { Button, Modal } from "antd"
import Header from "../Header/Header"
import Campaign from "../Campaign/Campaign"
import { useState, useEffect } from 'react'
import { createCampaign, fetchAllCampaigns } from "../../logics/gift"
import { fetchAccountAddress } from "../../logics/wallet"
import { CampaignType } from "../types"
import { toast } from "react-toastify"

const DashboardPage = () => {

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [account, setAccount] = useState('')
  const [campaigns, setCampaigns] = useState(Array.from<CampaignType>([]))

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  // const [imageURL, setImageURL] = useState("");
  const [imageURL, setImageURL] = useState('')
  const [associatedLink, setAssociatedLink] = useState("");
  const [targetAmount, setTargetAmount] = useState("");


  const showModal = () => {
    setIsModalVisible(true);
  };

  const handleOk = () => {
    setIsModalVisible(false);

    if (account !== undefined && account !== '')
      createCampaign(account, title, description, targetAmount, imageURL, associatedLink).then((r) => {
        toast(`Created campaign successfully!`)
        setTitle('')
        setDescription('')
        setImageURL('')
        setAssociatedLink('')
        setTargetAmount('')

        window.location.reload()
      }).catch((e) => {
        toast(`Unable to create campaign: ${e}`)
      })
  };

  const handleCancel = () => {
    setIsModalVisible(false);
  };

  useEffect(() => {
    fetchAccountAddress().then(val => setAccount(val))
  }, [])

  useEffect(() => {
    if (account) {
      fetchAllCampaigns(account).then(campaigns => {
        let data = Array.from<CampaignType>([])
        campaigns.forEach((camp: any) => {
          const { title, description, image, collectedAmount, targetAmount, externalLink } = camp
          data.push({ title, description, collectedAmount, targetAmount, image, externalLink } as CampaignType)
        })
        setCampaigns(data)
      }
      )
    }
  }, [account])

  return (
    <div className="dashboard-container h-screen ">
      <Header accountAddress="" />

      <div className="h-5/6">
        <h1 className="dashboard-heading flex flex-row m-4 text-3xl font-semibold drop-shadow-xl" >Your Campaigns
          <Button onClick={() => showModal()} className="flex justify-center items-center ml-4" type="primary" shape="round" size="middle" style={{ height: "36px", width: "180px", display: 'flex', flexDirection: 'row' }} > Create Campaign <PlusCircleOutlined /> </Button>
        </h1>
        <Campaign address={account} arr={campaigns} />
      </div>

      <Modal title="Create Campaign" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}
        footer={[
          <Button key="back" shape="round" size="middle" onClick={handleCancel}>
            Cancel
          </Button>,
          <Button key="submit" shape="round" size="middle" type="primary" onClick={handleOk}>
            Create
          </Button>,
        ]}>
        <div className="flex h-4/6 flex-col">

          <label className="font-bold" htmlFor="title">Title </label>
          <input value={title} className="px-2 mb-3 border-2 border-red-300 rounded-lg bg-red-100" onChange={(e) => setTitle(e.target.value)} placeholder="Title" />

          <label className="font-bold" htmlFor="description">Description </label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} className="px-2 border-2 border-red-300 mb-3 rounded-lg bg-red-100" placeholder="Description" />

          <label className="font-bold" htmlFor="image">Image URL </label>
          <input type="text" className="px-2 mb-3 border-2 border-red-300 rounded-lg bg-red-100" placeholder="Image URL" value={imageURL} onChange={(e) => setImageURL(e.target.value)} />

          <label className="font-bold mt-3" htmlFor="associatedLink">Associated Link </label>
          <input value={associatedLink} onChange={(e) => setAssociatedLink(e.target.value)} className="px-2 mb-3 border-2 border-red-300 rounded-lg bg-red-100" placeholder="Associated Link" />

          <label className="font-bold" htmlFor="targetAmount">Target Amount (in MATIC)</label>
          <input type="text" placeholder="0" value={targetAmount} onChange={(e) => setTargetAmount(e.target.value)} className="px-2 border-2 border-red-300 rounded-lg bg-red-100" />

        </div>
      </Modal>
    </div>
  )
}


export default DashboardPage;