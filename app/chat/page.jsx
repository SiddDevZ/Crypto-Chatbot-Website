"use client";
import React, { useState, useEffect } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import CryptoCoins from "@/components/CryptoCoins/CryptoCoins";
import { aiQuickAccess, coins, aiCoins } from "./data.js";
import models from "./models.js";
import Input from "../../components/Input/Input";
const fakeChats = [
  {
    id: 1,
    userMessage: {
      text: "Can you show me the latest ETH price analysis?",
      timestamp: "2:46 PM",
    },
    botResponse: {
      text: "Sure! Ethereum is currently trading at $3,400 with a 24h volume of $12B. The RSI indicates...",
      timestamp: "2:46 PM",
    },
  },
  {
    id: 2,
    userMessage: {
      text: "What is the current BTC price?",
      timestamp: "2:50 PM",
    },
    botResponse: {
      text: "Bitcoin is currently trading at $45,000 with a 24h volume of $30B.",
      timestamp: "2:51 PM",
    },
  },
];
const Home = () => {
  const [sidebarState, setSidebarState] = useState("closed");
  const [selectedModel, setSelectedModel] = useState("AI Web3 Chatbot");
  const [isGenerating, setIsGenerating] = useState(false);
  const [startedGenerating, setStartedGenerating] = useState(false);

  const toggleSidebar = () => {
    setSidebarState((prev) => {
      if (prev === "open" || prev === "opening") {
        setTimeout(() => setSidebarState("closed"), 300);
        return "closing";
      }
      setTimeout(() => setSidebarState("open"), 50);
      return "opening";
    });
  };

  const handleSendMessage = async (message, provider) => {
    setStartedGenerating(true);
    console.log("Sending message:", message);
    console.log("Generating response... ", provider);
  };

  useEffect(() => {
    document.body.style.overflow = sidebarState === "opening" ? "hidden" : "";
  }, [sidebarState]);

  return (
    <div className="flex min-h-screen bg-[#131414] overflow-x-hidden">
      {/* Responsive Sidebar */}
      <div
        className={`fixed top-0 left-0 h-full z-50 ${
          sidebarState === "closing" ? "overflow-hidden" : "overflow-y-auto"
        }`}
      >
        <div
          className={`h-full transition-all duration-300 ease-in-out ${
            sidebarState === "open" ? "w-screen lg:w-[35rem]" : "w-0"
          }`}
        >
          <div className="h-full bg-[#070707] relative">
            <div className="absolute inset-0 flex flex-col">
              <div className="flex-1 pt-10 overflow-y-auto  p-4">
                {sidebarState === "open" && (
                  <button
                    onClick={toggleSidebar}
                    className="text-white p-2 bg-[#0c0c0c] hover:bg-[#151515] border border-[#202020] rounded-full transition-colors z-50 absolute top-4 left-4"
                  >
                    <RiCloseLine className="text-xl text-[#c0c0c0]" />
                  </button>
                )}
                <div className="px-2 lg:px-4 text-white">
                  <div className="flex overflow-x-auto sm:overflow-x-visible space-x-4 px-1.5 pb-4 scrollbar-thin scrollbar-thumb-[#383838]">
                    <CryptoCoins coins={coins} text={"Top Trending Coins"} />
                    <CryptoCoins coins={aiCoins} text={"Top AI Coins"} />
                  </div>

                  <div className="px-2.5 pt-2 pb-6">
                    <h2 className="font-inter cursor-default text-[0.95rem] font-semibold text-[#9D9D9D] mb-4">
                      AI Chat Quick Access
                    </h2>
                    <div className="grid grid-cols-2 gap-2 sm:gap-4">
                      {aiQuickAccess.map((item) => (
                        <div
                          key={item.index}
                          className="bg-[#0E0E0E] p-4 lg:p-6 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 cursor-pointer"
                        >
                          <img
                            src={item.icon}
                            alt={item.title}
                            className="w-9 h-auto mb-3 lg:mb-4"
                          />
                          <h3 className="text-[#E0E0E0] font-semibold text-base lg:text-[1.1rem] mb-1">
                            {item.title}
                          </h3>
                          <p className="text-[#AFAFAF] text-[0.73rem] sm:text-sm">
                            {item.description}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`flex-1 min-h-screen bg-[#131414] transition-all duration-300 ${
          sidebarState === "open" ? "lg:ml-[35rem]" : ""
        }`}
      >
        {sidebarState === "closed" && (
          <button
            onClick={toggleSidebar}
            className="fixed group top-4 left-4 z-50 text-white p-2 rounded-full"
          >
            <RiMenuLine className="text-xl transition-all ease-in-out group-hover:scale-110" />
          </button>
        )}

        {!startedGenerating ? (
          <div className="w-full h-screen flex flex-col mx-auto text-center">
            <div className="flex-1 flex flex-col sm:mt-0 mt-[12vh] sm:justify-center">
              <div className="mx-auto sm:w-[80%] w-[91%] py-8 lg:py-12">
                <h2 className="font-inter mb-6 text-start sm:text-center font-medium text-[#d9d9d9] lg:mb-8 text-3xl md:text-4xl lg:text-5xl ">
                  What do you want to know?
                </h2>
                <Input
                  isGenerating={isGenerating}
                  handleSendMessage={handleSendMessage}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  models={models}
                />
                <div className="w-full max-w-[37rem] mx-auto space-y-3 mt-10">
                  {[
                    [
                      {
                        icon: "/doc.svg",
                        text: "Aggregate any amount of web3 market statistics",
                      },
                      {
                        icon: "/live.svg",
                        text: "Live information tracking of 5,000+ cryptos.",
                      },
                    ],
                    [
                      {
                        icon: "/chain.svg",
                        text: "Interact with Blockchains and keep track of Conversations",
                      },
                      {
                        icon: "/clock.svg",
                        text: "AI Generated News and Up-to-date 2024 knowledge",
                      },
                    ],
                  ].map((row, rowIndex) => (
                    <div key={rowIndex} className="flex w-full space-x-4">
                      {row.map((item, itemIndex) => (
                        <div
                          key={itemIndex}
                          className="sm:h-[4.4rem] border border-[#2c2c2c] bg-[#1C1C1C] hover:bg-[#1f1f1f] cursor-pointer w-[50%] rounded-lg hover:-translate-y-[0.1rem] filter drop-shadow-sm duration-200 transition-all ease-in-out flex items-center p-3"
                        >
                          <div className="w-9 h-9 bg-[#afb7af] flex-shrink-0 flex justify-center items-center rounded-sm">
                            <img src={item.icon} alt="" className="w-6 h-6" />
                          </div>
                          <h5 className="sm:text-sm text-[0.65rem] unselectable ml-3 font-inter font-medium text-[#bababa] text-start flex-grow">
                            {item.text}
                          </h5>
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        ) : (
          /* Add your chat interface here */
          <div className="min-h-screen w-[94%] max-w-3xl mx-auto flex flex-col">
            <div className="flex-1 overflow-y-auto mt-[15vh] p-4">
              {/* <div className=" max-w-4xl bg-red-500 mx-auto h-10">

              </div> */}
              {fakeChats.map((chat, index) => (
                <div
                  key={index}
                  className={`chat-entry mb-4 pb-8 ${index !== fakeChats.length - 1 ? 'border-[#333333] border-b' : ''}`}
                >
                  <div className="text-[#f8f8f8] p-3 rounded-lg mb-2">
                    <span className="font-semibold text-2xl">{chat.userMessage.text}</span>
                  </div>
                  <div className="w-full px-5 py-5 border border-[#292929] rounded-2xl">
                    <h2>Workflow</h2>
                  </div>
                  <div className="font-medium text-[#434343] p-3 rounded-lg mb-2">
                    <span>{chat.botResponse.text}</span>
                  </div>
                  {/* <div className="w-full mt-5">
                    <div className="flex w-auto px-2 border rounded-xl space-x-2">
                      <img src="/bulb.svg" alt="" />
                      <h2>Web3 Chatbot</h2>
                    </div>
                  </div> */}
                </div>
              ))}
            </div>
            <div className="pb-4 px-3 flex-shrink-0 fixed bottom-0 left-0 right-0 md:relative">
              <Input
                isGenerating={isGenerating}
                handleSendMessage={handleSendMessage}
                selectedModel={selectedModel}
                setSelectedModel={setSelectedModel}
                models={models}
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
