"use client";
import React, { useState, useEffect, useRef, useCallback } from "react";
import { RiMenuLine, RiCloseLine } from "react-icons/ri";
import CryptoCoins from "@/components/CryptoCoins/CryptoCoins";
import { aiQuickAccess, coinss, aiCoinss } from "./data.js";
import models from "./models.js";
import Input from "../../components/Input/Input";
import { RiArrowDownSLine } from "react-icons/ri";
import io from "socket.io-client";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { CodeBlock } from "../../components/ui/code-block";
import axios from "axios";

const WorkflowSection = ({ show = false, thinking = false }) => {
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
    <svg
      className="animate-spin h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
    >
      <circle
        className="opacity-25"
        cx="12"
        cy="12"
        r="10"
        stroke="currentColor"
        strokeWidth="4"
      ></circle>
      <path
        className="opacity-75"
        fill="currentColor"
        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
      ></path>
    </svg>
  );

  const CheckmarkIcon = () => (
    <svg
      className="h-4 w-4"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M5 13l4 4L19 7"
      />
    </svg>
  );

  return (
    <div
      onClick={() => setIsExpanded(!isExpanded)}
      className="w-full cursor-pointer px-5 py-4 border unselectable border-[#292929] rounded-2xl text-[#E0E0E0]"
    >
      <div className="flex justify-between items-center cursor-pointer">
        <div className="flex items-center space-x-2">
          <h2 className="font-semibold">Workflow</h2>
        </div>
        <RiArrowDownSLine
          className={`text-xl transition-transform duration-300 ${
            isExpanded ? "transform rotate-180" : ""
          }`}
        />
      </div>
      <div
        ref={contentRef}
        className="overflow-hidden transition-all duration-300 ease-in-out"
        style={{ maxHeight: isExpanded ? `${contentHeight}px` : "0px" }}
      >
        <div className="mt-4 space-y-3">
          {/* Thinking Step - Always in DOM */}
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-[#1C1C1C] flex items-center justify-center">
              {thinking ? <CheckmarkIcon /> : <LoadingIcon />}
            </div>
            <span>Thinking</span>
          </div>

          {/* Generating Step - Hidden with display:none until needed */}
          {/* <div 
            className="flex items-center space-x-2"
            style={{ display: !thinking ? 'none' : 'flex' }}
          >
            <div className="w-5 h-5 rounded-full bg-[#1C1C1C] flex items-center justify-center">
              {startedResponding ? <LoadingIcon /> : <CheckmarkIcon />}
            </div>
            <span>Generating</span>
          </div> */}
        </div>
      </div>
    </div>
  );
};

const Home = () => {
  const [sidebarState, setSidebarState] = useState("closed");
  const [selectedModel, setSelectedModel] = useState(0);
  const [isGenerating, setIsGenerating] = useState(false);
  const [startedGenerating, setStartedGenerating] = useState(false);
  const [startedResponding, setStartedResponding] = useState(false);
  const [messages, setMessages] = useState([]);
  const [doneResponding, setDoneResponding] = useState(false);
  const [metaData, setMetaData] = useState([]);
  const bufferRef = useRef('');
  const [, forceUpdate] = useState();

  const updateGeneratingMessage = useCallback((newText) => {
    setGeneratingMessage((prev) => ({
      ...prev,
      botResponse: {
        ...prev.botResponse,
        text: newText,
      },
    }));
  }, []);
  const [coins, setCoins] = useState(coinss);
  const [aiCoins, setAiCoins] = useState(aiCoinss);
  const chatContainerRef = useRef(null);
  const messagesEndRef = useRef(null);
  
  const [generatingMessage, setGeneratingMessage] = useState({
    id: 69,
    userMessage: {
      text: "This is an genearitng message lol?",
    },
    botResponse: {
      text: "",
      model: 0,
    },
  });
  const [socket, setSocket] = useState(null);
  const autoScroll = useRef(true);

  useEffect(() => {
    if (autoScroll.current) {
      messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages, generatingMessage]);

  useEffect(() => {
    const container = document.querySelector('.overflow-y-auto');
    const handleScroll = () => {
      const { scrollTop, scrollHeight, clientHeight } = container;
      autoScroll.current = scrollHeight - (scrollTop + clientHeight) < 100;
    };
    
    container?.addEventListener('scroll', handleScroll);
    return () => container?.removeEventListener('scroll', handleScroll);
  }, []);
  

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 1024) {
        setSidebarState("open");
      } else {
        setSidebarState("closed");
      }
    };
    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    // const newSocket = io("http://localhost:3001");
    const newSocket = io("https://crypto-chatbot-website.onrender.com");

    newSocket.on("error", (errorMsg) => {
      console.error("Server error:", errorMsg);
      // Handle UI error state here
    });

    setSocket(newSocket);
    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const fetchTopCoins = async () => {
      try {
        const topCoinsResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              order: "market_cap_desc",
              per_page: 5,
              page: 1,
            },
          }
        );

        const formattedTopCoins = topCoinsResponse.data.map((coin) => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          priceChange: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
          logo: coin.image,
        }));

        setCoins(formattedTopCoins);
      } catch (error) {
        console.error("Error fetching top coins:", error);
      }
    };

    const fetchAICoins = async () => {
      try {
        // Define AI-related cryptocurrency IDs (replace with actual IDs if needed)
        const aiCoinIds = [
          "bittensor",
          "singularitynet",
          "injective-protocol",
          "the-graph",
          "numeraire",
        ];

        // Fetch data for AI-related coins from CoinGecko
        const aiCoinsResponse = await axios.get(
          "https://api.coingecko.com/api/v3/coins/markets",
          {
            params: {
              vs_currency: "usd",
              ids: aiCoinIds.join(","),
            },
          }
        );

        // Format AI coins
        const formattedAICoins = aiCoinsResponse.data.map((coin) => ({
          name: coin.name,
          symbol: coin.symbol.toUpperCase(),
          priceChange: `${coin.price_change_percentage_24h >= 0 ? '+' : ''}${coin.price_change_percentage_24h.toFixed(2)}%`,
          logo: coin.image,
        }));

        setAiCoins(formattedAICoins);
      } catch (error) {
        console.error("Error fetching AI coins:", error);
      }
    };

    fetchTopCoins();
    fetchAICoins();
  }, []);

  const handleSendMessage = async (message, provider) => {
    // responseBuffer.current = "";
    // startAutoScroll();
    setStartedGenerating(true);
    setIsGenerating(true);
    setStartedResponding(false);
    setDoneResponding(false);
    console.log("Sending message:", message);
    console.log("Generating response... ", provider);

    if (generatingMessage.id != 69) {
      setMessages((prevMessages) => [...prevMessages, generatingMessage]);
    }
    setGeneratingMessage({
      id: Date.now(),
      userMessage: { text: message },
      botResponse: { text: "", model: provider },
    });

    if (socket) {
      let specializedPrompt = "";
      switch (provider) {
        case 0: // AI Web3 Chatbot
          specializedPrompt = ``;
          break;
        case 1: // Ask Crypto People
          specializedPrompt = `You are simulating a panel of crypto experts with diverse perspectives. Your task is to provide insights and opinions on cryptocurrency-related topics as if they were coming from experienced professionals in the field. Stay focused on the user's input and offer well-reasoned, concise responses that reflect expert knowledge. Avoid unnecessary elaboration unless explicitly requested by the user, Reply to this prompt by the user: `;
          break;
        case 2: // AI News
          specializedPrompt = `You are an AI news aggregator specializing in crypto and blockchain updates. Your task is to summarize the latest news articles in a concise, factual, and neutral manner based on the user's query. Avoid speculating or editorializing; focus only on delivering key takeaways or implications relevant to the crypto market, Answer to this prompt by the user: `;
          break;
        case 3: // AI Trading Assistant
          specializedPrompt = `You are an AI-powered trading assistant focused on providing actionable trading suggestions, technical analysis, and market insights for cryptocurrencies. Respond only to the user's query and ensure your advice is backed by reasoning or data points. Avoid speculative or overly risky recommendations unless explicitly requested by the user. Keep your tone professional and your advice practical. Answer to this prompt by the user: `;
          break;
        default:
          specializedPrompt = `You are a helpful assistant designed to provide accurate and relevant information based on user queries. Ensure your responses are clear, concise, and directly address the user's needs.`;
      }
    
      const fullPrompt = `${specializedPrompt} "${message}"`;
      socket.emit("send", { prompt: fullPrompt, provider: provider });

      let accumulatedChunks = '';
      let lastUpdateTime = Date.now();

      socket.on("chunk", (chunk) => {
        setStartedResponding(true);
        accumulatedChunks += chunk;

        // Update every 100ms to balance between responsiveness and performance
        if (Date.now() - lastUpdateTime > 10) {
          updateGeneratingMessage(accumulatedChunks);
          lastUpdateTime = Date.now();
        }
      });

      socket.on("done", () => {
        // Final update with all accumulated chunks
        updateGeneratingMessage(accumulatedChunks);

        if (accumulatedChunks.trim() === "") {
          setGeneratingMessage((prev) => ({
            ...prev,
            botResponse: { 
              text: "Error generating your message, either API issue or you have been rate limited." 
            }
          }));
        }
        setIsGenerating(false);
        setDoneResponding(true);
        accumulatedChunks = '';
      });

      return () => {
        socket.off("chunk");
        socket.off("done");
      };
    }
  };

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

  useEffect(() => {
    if (typeof window !== "undefined") {
      document.body.style.overflow = sidebarState === "opening" ? "hidden" : "";
    }
  }, [sidebarState]);

  return (
    <>
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
                      {Object.values(models).map((model, index) => (
                        <div
                          key={index}
                          onClick={() => setSelectedModel(model.index)}
                          className="bg-[#0E0E0E] p-4 lg:p-6 rounded-lg hover:bg-[#1A1A1A] transition-all duration-300 cursor-pointer"
                        >
                          <img
                            src={model.icon}
                            alt={model.display}
                            className="w-9 h-auto mb-3 lg:mb-4"
                          />
                          <h3 className="text-[#E0E0E0] font-semibold text-base lg:text-[1.1rem] mb-1">
                            {model.display}
                          </h3>
                          <p className="text-[#AFAFAF] text-[0.7rem] sm:text-sm">
                            {model.description}
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

        {!startedGenerating && !isGenerating ? (
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
                    Object.values(models).slice(0, 2),
                    Object.values(models).slice(2)
                  ].map((row, rowIndex) => (
                    <div key={rowIndex} className="flex w-full space-x-4">
                      {row.map((model, modelIndex) => (
                        <div
                          key={modelIndex}
                          className="sm:h-[4.4rem] border border-[#2c2c2c] bg-[#1C1C1C] hover:bg-[#1f1f1f] cursor-pointer w-[50%] rounded-lg hover:-translate-y-[0.1rem] filter drop-shadow-sm duration-200 transition-all ease-in-out flex items-center p-3"
                        >
                          <div className="w-9 h-9 bg-[#afb7af] flex-shrink-0 flex justify-center items-center rounded-sm">
                            <img src={model.icon} alt="" className="w-6 h-6" />
                          </div>
                          <h5 className="sm:text-sm text-[0.65rem] unselectable ml-3 font-inter font-medium text-[#bababa] text-start flex-grow">
                            {model.description}
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
              <div ref={chatContainerRef} className="w-[94%] max-w-3xl mx-auto mt-[15vh] p-4">
                {messages.map((chat, index) => (
                  <div
                    key={index}
                    // ref={chatContainerRef}
                    className={`chat-entry mb-4 pb-8 ${
                      index !== messages.length - 1
                        ? "border-[#333333] border-b"
                        : ""
                    }`}
                  >
                    {console.log(chat.model)}
                    <div className="text-[#f8f8f8] p-3 rounded-lg mb-2">
                      <span className="font-semibold text-lg flex items-center">
                        <i className="ri-user-3-fill w-7 h-7 rounded-full bg-[#1f201f] text-[#13398a] flex items-center justify-center mr-2"></i>
                        {chat.userMessage.text}
                      </span>
                    </div>
                    <WorkflowSection
                      show={false}
                      thinking={true}
                      generating={true}
                    />
                    <div className="font-medium text-[#434343] p-3 rounded-lg mb-2">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          code({
                            node,
                            inline,
                            className,
                            children,
                            ...props
                          }) {
                            const match = /language-(\w+)/.exec(
                              className || ""
                            );
                            return !inline && match ? (
                              <CodeBlock
                                language={match[1]}
                                filename={`${
                                  match[1].charAt(0).toUpperCase() +
                                  match[1].slice(1)
                                } Code`}
                                code={String(children).replace(/\n$/, "")}
                              />
                            ) : (
                              <code className={className} {...props}>
                                {children}
                              </code>
                            );
                          },
                        }}
                        className="zenos-markdown-content"
                      >
                        {chat.botResponse.text}
                      </ReactMarkdown>
                      {/* <span>{chat.botResponse.text}</span> */}
                    </div>
                    <div className="w-full mt-5 flex justify-between items-center">
                      <div className="inline-flex unselectable items-center max-w-max px-2 py-[0.47rem] border border-[#343434] rounded-xl space-x-2">
                        <img
                          src={
                            Object.values(models)[chat.botResponse.model]
                              ?.icon || "/bulb.svg"
                          }
                          alt="Model icon"
                          className="w-5 h-5"
                        />
                        <h2 className="text-sm">
                          {Object.values(models)[chat.botResponse.model]
                            ?.display || "Web3 Chatbot"}
                        </h2>
                        {console.log(`Model: ${chat.botResponse.model}`)}
                      </div>
                      <div className="flex items-center space-x-4">
                        <button
                          onClick={() => {
                            /* Add copy functionality */
                          }}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-file-copy-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            /* Add like functionality */
                          }}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-up-line"></i>
                        </button>
                        <button
                          onClick={() => {
                            /* Add dislike functionality */
                          }}
                          className="transition-all ease-in-out hover:scale-105"
                        >
                          <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-down-line"></i>
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                {generatingMessage && (
                  <div className="chat-entry mb-16 pb-8">
                    <div className="text-[#f8f8f8] p-3 rounded-lg mb-2">
                      <span className="font-semibold text-lg flex items-center">
                        <i className="ri-user-3-fill w-7 h-7 rounded-full bg-[#1f201f] text-[#13398a] flex items-center justify-center mr-2"></i>
                        {generatingMessage.userMessage.text}
                      </span>
                    </div>
                    <WorkflowSection show={true} thinking={startedResponding} />
                    <div className="font-medium text-[#434343] p-3 rounded-lg mb-2">
                      <span className="flex items-center">
                        {/* <i className="ri-robot-fill w-7 h-7 rounded-full bg-[#1f201f] text-[#13398a] flex items-center justify-center mr-2"></i> */}
                        {generatingMessage.botResponse.text ? (
                          <div>
                            <ReactMarkdown
                              remarkPlugins={[remarkGfm]}
                              components={{
                                code({
                                  node,
                                  inline,
                                  className,
                                  children,
                                  ...props
                                }) {
                                  const match = /language-(\w+)/.exec(
                                    className || ""
                                  );
                                  return !inline && match ? (
                                    <CodeBlock
                                      language={match[1]}
                                      filename={`${
                                        match[1].charAt(0).toUpperCase() +
                                        match[1].slice(1)
                                      } Code`}
                                      code={String(children).replace(/\n$/, "")}
                                    />
                                  ) : (
                                    <code className={className} {...props}>
                                      {children}
                                    </code>
                                  );
                                },
                              }}
                              className="zenos-markdown-content"
                            >
                              {generatingMessage.botResponse.text}
                            </ReactMarkdown>
                            <span className="ml-2 h-4 w-2 bg-gray-400 animate-cursor-blink"></span>
                          </div>
                        ) : (
                          <span className="flex items-center">
                            <span className="text-[#d1d1d1]">
                              Generating response
                            </span>
                            <span className="ml-2 h-4 w-2 bg-gray-400 animate-cursor-blink"></span>
                          </span>
                        )}
                      </span>
                    </div>
                    {doneResponding && (
                      <div className="w-full mt-5 flex justify-between items-center">
                        <div></div>
                        <div className="flex items-center space-x-4">
                          <button
                            onClick={() => {
                              /* Add copy functionality */
                            }}
                            className="transition-all ease-in-out hover:scale-105"
                          >
                            <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-file-copy-line"></i>
                          </button>
                          <button
                            onClick={() => {
                              /* Add like functionality */
                            }}
                            className="transition-all ease-in-out hover:scale-105"
                          >
                            <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-up-line"></i>
                          </button>
                          <button
                            onClick={() => {
                              /* Add dislike functionality */
                            }}
                            className="transition-all ease-in-out hover:scale-105"
                          >
                            <i className="text-[#7e7e7e] hover:text-[#a4a4a4] transition-all ease-in-out ri-thumb-down-line"></i>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                )}
                <div ref={messagesEndRef}></div>
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
    </>
  );
};

export default Home;
