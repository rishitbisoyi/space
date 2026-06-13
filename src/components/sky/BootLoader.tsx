"use client";

import { BootMessage } from "@/types/sky";

interface BootLoaderProps { messages: BootMessage[]; }

export default function BootLoader({ messages }: BootLoaderProps) {
  return (
    <div className="mc-panel">
      <div className="mc-panel-header">
        <span className="status-led amber" />
        SYSTEM BOOT SEQUENCE
      </div>
      <div className="mc-panel-body">
        <div className="boot-sequence">
          {messages.map((msg, i) => (
            <div key={i} className={`boot-line boot-line--${msg.status}`}>
              <span className="boot-prefix">
                {msg.status === "done"    && "[  OK  ] "}
                {msg.status === "active"  && "[ .... ] "}
                {msg.status === "pending" && "[      ] "}
                {msg.status === "error"   && "[ ERR  ] "}
              </span>
              <span>{msg.text}</span>
              {msg.status === "active" && (
                <span className="boot-cursor">_</span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}