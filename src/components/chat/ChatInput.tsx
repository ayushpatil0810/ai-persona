"use client";

import {
  useState,
  useRef,
  useCallback,
  type KeyboardEvent,
  type ChangeEvent,
} from "react";
import { Paperclip, X, ArrowUp, Square } from "lucide-react";
import Image from "next/image";

interface ChatInputProps {
  onSend: (message: string, images?: string[]) => void;
  onStop: () => void;
  isStreaming: boolean;
  disabled?: boolean;
}

export function ChatInput({ onSend, onStop, isStreaming, disabled }: ChatInputProps) {
  const [value, setValue] = useState("");
  const [images, setImages] = useState<string[]>([]);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSend = useCallback(() => {
    const trimmed = value.trim();
    if ((!trimmed && images.length === 0) || isStreaming) return;
    onSend(trimmed, images);
    setValue("");
    setImages([]);
    // Reset height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  }, [value, images, isStreaming, onSend]);

  const handleKeyDown = useCallback(
    (e: KeyboardEvent<HTMLTextAreaElement>) => {
      if (e.key === "Enter" && !e.shiftKey) {
        e.preventDefault();
        handleSend();
      }
    },
    [handleSend]
  );

  const handleChange = useCallback((e: ChangeEvent<HTMLTextAreaElement>) => {
    setValue(e.target.value);
    // Auto-grow textarea
    const el = e.target;
    el.style.height = "auto";
    el.style.height = `${Math.min(el.scrollHeight, 200)}px`;
  }, []);

  const handleFileChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newImages: string[] = [];
    let processed = 0;

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 5 * 1024 * 1024) {
        alert("File size exceeds 5MB limit.");
        processed++;
        continue;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          newImages.push(event.target.result as string);
        }
        processed++;
        if (processed === files.length) {
          setImages((prev) => [...prev, ...newImages]);
          if (fileInputRef.current) fileInputRef.current.value = "";
        }
      };
      reader.readAsDataURL(file);
    }
  }, []);

  const removeImage = (index: number) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const canSend = (value.trim().length > 0 || images.length > 0) && !isStreaming;

  return (
    <div className="relative">
      <div
        className="
          flex items-end gap-2 rounded-3xl
          bg-card/80 border border-border
          px-4 py-3
          shadow-md
          focus-within:border-orange-500/50 focus-within:ring-4 focus-within:ring-orange-500/10
          transition-all duration-300 ease-out
          backdrop-blur-2xl
        "
      >
        {/* Hidden File Input */}
        <input
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          ref={fileInputRef}
          onChange={handleFileChange}
        />

        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled || isStreaming}
          className="flex items-center justify-center w-8 h-8 flex-shrink-0 text-muted-foreground hover:text-foreground hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring rounded-full transition-colors disabled:opacity-50"
          aria-label="Attach images"
        >
          <Paperclip size={18} />
        </button>

        <div className="flex-1 flex flex-col min-w-0">
          {images.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-2 pt-1">
              {images.map((img, i) => (
                <div key={i} className="relative group w-14 h-14 rounded-md overflow-hidden border border-border">
                  <Image src={img} alt="Attachment" fill className="object-cover" />
                  <button
                    type="button"
                    onClick={() => removeImage(i)}
                    className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center text-white focus-visible:opacity-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1"
                    aria-label="Remove image"
                  >
                    <X size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}

          <textarea
            ref={textareaRef}
            value={value}
            onChange={handleChange}
            onKeyDown={handleKeyDown}
            placeholder="Ask anything… (Enter to send, Shift+Enter for new line)"
            rows={1}
            disabled={disabled}
            className="
              flex-1 resize-none bg-transparent outline-none
              text-sm text-foreground
              placeholder:text-muted-foreground
              leading-relaxed
              disabled:opacity-50
              py-1.5
              min-h-[32px] max-h-[200px]
            "
            aria-label="Chat message input"
          />
        </div>

        <div className="flex-shrink-0">
          {isStreaming ? (
            <button
              onClick={onStop}
              className="flex items-center justify-center w-8 h-8 rounded-full bg-zinc-800 dark:bg-zinc-200 text-zinc-100 dark:text-zinc-800 hover:opacity-80 transition-opacity shadow-sm"
              aria-label="Stop generating"
            >
              <Square size={14} className="fill-current" />
            </button>
          ) : (
            <button
              onClick={handleSend}
              disabled={!canSend}
              className={`
                flex items-center justify-center w-8 h-8 rounded-full transition-all duration-200
                ${canSend 
                  ? "bg-orange-500 text-white shadow-[0_2px_10px_rgba(249,115,22,0.3)] hover:bg-orange-600 hover:scale-105 active:scale-95" 
                  : "bg-black/5 dark:bg-white/10 text-zinc-400 dark:text-zinc-500 cursor-not-allowed"}
              `}
              aria-label="Send message"
            >
              <ArrowUp size={18} strokeWidth={2.5} />
            </button>
          )}
        </div>
      </div>

      <p className="text-center text-[11px] text-[var(--text-placeholder)] mt-2">
        AI can make mistakes — verify important information.
      </p>
    </div>
  );
}
