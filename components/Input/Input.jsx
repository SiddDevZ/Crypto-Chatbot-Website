import React, { useState, useRef, useEffect } from "react";
import 'remixicon/fonts/remixicon.css'

const ModelDropdown = ({ selectedModel, setSelectedModel, models, isOpen, onToggle }) => {
  const dropdownRef = useRef(null);
  const [animate, setAnimate] = useState(false);

  // Convert models object to array for index-based access
  const modelEntries = Object.values(models);
  
  // Get selected model details using index
  const selectedModelData = modelEntries[selectedModel] || {};

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        startCloseAnimation();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      setAnimate(true);
    }
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen]);

  const startCloseAnimation = () => {
    setAnimate(false);
    setTimeout(() => onToggle(false), 300);
  };

  const handleModelSelect = (index) => {
    setSelectedModel(index);
    startCloseAnimation();
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Trigger Button */}
      <button
        onClick={() => onToggle(!isOpen)}
        type="button"
        className="flex items-center gap-2 bg-[#212121] px-3 py-2 rounded-lg border border-[#383838] hover:border-[#414141] transition-colors"
      >
        {selectedModelData.icon && (
          <img 
            src={selectedModelData.icon} 
            className="w-5 h-5 object-contain"
            alt="Model icon"
            onError={(e) => e.target.style.display = 'none'}
          />
        )}
        <span className="text-[#16b616] font-inter text-sm">
          {selectedModelData.display}
        </span>
        <i className={`ri-arrow-down-s-line text-[#8e8e8e] transition-transform ${isOpen ? "rotate-180" : ""}`} />
      </button>

      {/* Desktop Dropdown */}
      {isOpen && (
        <div className={`hidden sm:block absolute bottom-full mb-2 w-64 right-0 bg-[#212121] border border-[#383838] rounded-lg shadow-lg z-50 transition-opacity duration-300 ${animate ? "opacity-100" : "opacity-0"}`}>
          {modelEntries.map((model, index) => (
            <button
              key={model.value}
              type="button"
              onClick={() => handleModelSelect(index)}
              className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-[#2a2a2a] text-sm transition-colors"
            >
              <div className="flex items-center gap-2">
                {model.icon && <img src={model.icon} className="w-5 h-5 object-contain" alt="" />}
                <div className="text-left">
                  <div className="text-[#e2e2e2]">{model.display}</div>
                  <div className="text-[#8e8e8e] text-xs mt-0.5">{model.description}</div>
                </div>
              </div>
              {selectedModel === index && <i className="ri-check-line text-[#24ce24]" />}
            </button>
          ))}
        </div>
      )}

      {/* Mobile Dropdown */}
      {isOpen && (
        <div className={`sm:hidden fixed bottom-0 left-0 right-0 bg-[#212121] border-t border-[#383838] rounded-t-lg z-50 transform transition-transform duration-300 ${animate ? "translate-y-0" : "translate-y-full"}`}>
          <div className="p-2">
            <div className="flex justify-end mb-1">
              <button 
                type="button"
                onClick={startCloseAnimation}
                className="p-1 text-[#8e8e8e] hover:text-[#e2e2e2] transition-colors"
              >
                <i className="ri-close-line text-lg" />
              </button>
            </div>
            <div className="max-h-[50vh] overflow-y-auto">
              {modelEntries.map((model, index) => (
                <button
                  key={model.value}
                  type="button"
                  onClick={() => handleModelSelect(index)}
                  className="flex items-center justify-between w-full px-3 py-2.5 hover:bg-[#2a2a2a] rounded-lg transition-colors"
                >
                  <div className="flex items-center gap-2">
                    {model.icon && <img src={model.icon} className="w-5 h-5 object-contain" alt="" />}
                    <div className="text-left">
                      <div className="text-[#e2e2e2] text-sm">{model.display}</div>
                      <div className="text-[#8e8e8e] text-xs mt-0.5">{model.description}</div>
                    </div>
                  </div>
                  {selectedModel === index && <i className="ri-check-line text-[#24ce24]" />}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};


const Input = ({ handleSendMessage, selectedModel, setSelectedModel, models, isGenerating }) => {
  const [message, setMessage] = useState("");
  const [openDropdown, setOpenDropdown] = useState(null);
  const textareaRef = useRef(null);

  const handleMessageChange = (e) => {
    setMessage(e.target.value);
    adjustTextareaHeight();
  };

  const adjustTextareaHeight = () => {
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
      textareaRef.current.style.height = `${textareaRef.current.scrollHeight}px`;
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (message.trim() && !isGenerating) {
      handleSendMessage(message, selectedModel);
      setMessage("");
      if (textareaRef.current) textareaRef.current.style.height = "auto";
    }
  };

  useEffect(() => {
    adjustTextareaHeight();
    textareaRef.current?.focus();
  }, [message]);

  return (
    <div className="w-full">
      <div className="max-w-[46rem] mx-auto">
        <form onSubmit={handleSubmit} className="bg-[#1f201f] rounded-xl border border-[#383838] shadow-lg">
          <div className="sm:px-4 sm:py-4 px-4 pt-3">
            <textarea
              ref={textareaRef}
              className="w-full resize-none bg-transparent text-[#c9c9c9] placeholder-[#989898] focus:outline-none
                scrollbar-thin scrollbar-thumb-[#383838] scrollbar-track-transparent pr-12"
              placeholder="Message YourMom..."
              rows={1}
              value={message}
              onChange={handleMessageChange}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && handleSubmit(e)}
            />
          </div>
          
          <div className="flex justify-between items-center px-4 py-3">
            <ModelDropdown
              selectedModel={selectedModel}
              setSelectedModel={setSelectedModel}
              models={models}
              isOpen={openDropdown === "model"}
              onToggle={(isOpen) => setOpenDropdown(isOpen ? "model" : null)}
            />
            
            <button
              type="submit"
              className="flex items-center justify-center w-10 h-10 rounded-full bg-[#213420] opacity-60 hover:bg-[#243823] 
                transition-all duration-200 hover:shadow-lg disabled:opacity-30 disabled:cursor-not-allowed"
              disabled={!message.trim() || isGenerating}
            >
              <i className="ri-arrow-right-line text-2xl text-[#24ce24]"></i>
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Input;
