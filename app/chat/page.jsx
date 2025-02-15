"use client";
import React, { useState, useEffect, useRef } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import CryptoCoins from "@/components/CryptoCoins/CryptoCoins";
import { aiQuickAccess, coins, aiCoins } from "./data.js";
import models from "./models.js";
import Input from "../../components/Input/Input";
import { RiArrowDownSLine } from 'react-icons/ri';

const WorkflowSection = ({ show = false, thinking = true, generating = false }) => {
  const [isExpanded, setIsExpanded] = useState(show);
  const contentRef = useRef(null);
  const [contentHeight, setContentHeight] = useState(0);

  useEffect(() => {
    if (contentRef.current) {
      setContentHeight(contentRef.current.scrollHeight);
    }
  }, [isExpanded]);

  useEffect(() => {
    setIsExpanded(show);
  }, [show]);

  const LoadingIcon = () => (
    <svg className="animate-spin h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
  );

  const CheckmarkIcon = () => (
    <svg className="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  );

  return (
    <div onClick={() => setIsExpanded(!isExpanded)} className="w-full cursor-pointer px-5 py-4 border unselectable border-[#292929] rounded-2xl text-[#E0E0E0]">
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold">Workflow</h2>
        </div>
        <RiArrowDownSLine 
          className={`text-xl transition-transform duration-300 ${isExpanded ? 'transform rotate-180' : ''}`} 
        />
      </div>
      <div 
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : '0px' }}
      >
        <div className="mt-4 space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-[#1C1C1C] flex items-center justify-center">
              {thinking ? <CheckmarkIcon /> : <LoadingIcon />}
            </div>
            <span>Thinking</span>
          </div>
          {thinking && (
            <div className="flex items-center space-x-2">
              <div className="w-5 h-5 rounded-full bg-[#1C1C1C] flex items-center justify-center">
                {generating ? <CheckmarkIcon /> : <LoadingIcon />}
              </div>
              <span>Generating</span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

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
    if (typeof window !== "undefined") {
      document.body.style.overflow = sidebarState === "opening" ? "hidden" : "";
    }
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
          <div className="flex flex-col h-screen relative">
            <div className="flex-1 overflow-y-auto pb-24">
              <div className="w-[94%] max-w-3xl mx-auto mt-[15vh] p-4">
                {fakeChats.map((chat, index) => (
                  <div
                    key={index}
                    className={`chat-entry mb-4 pb-8 ${
                      index !== fakeChats.length - 1
                        ? "border-[#333333] border-b"
                        : ""
                    }`}
                  >
                    <div className="text-[#f8f8f8] p-3 rounded-lg mb-2">
                      <span className="font-semibold text-lg flex items-center">
                        <i className="ri-user-3-fill w-7 h-7 rounded-full bg-[#1f201f] text-[#13398a] flex items-center justify-center mr-2"></i>
                        {chat.userMessage.text}
                      </span>
                    </div>
                    <WorkflowSection />
                    <div className="font-medium text-[#434343] p-3 rounded-lg mb-2">
                      <span>{chat.botResponse.text}</span>
                    </div>
                    <div className="w-full mt-5 flex justify-between items-center">
                      <div className="inline-flex unselectable items-center max-w-max px-2 py-2 border border-[#343434] rounded-xl space-x-2">
                        <img src="/bulb.svg" alt="" className="w-5 h-5" />
                        <h2 className="text-sm">Web3 Chatbot</h2>
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {/* Add copy functionality */}}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => {/* Add like functionality */}}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-up-line"></i>
                        </button>
                        <button
                          onClick={() => {/* Add dislike functionality */}}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-down-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="absolute bottom-0 left-0 right-0 pb-4 px-3 pt-0.5 bg-[#131414]">
              <div className="max-w-3xl mx-auto">
                <Input
                  isGenerating={isGenerating}
                  handleSendMessage={handleSendMessage}
                  selectedModel={selectedModel}
                  setSelectedModel={setSelectedModel}
                  models={models}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;