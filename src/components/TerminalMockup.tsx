import React, { useEffect, useState } from 'react';

const TerminalMockup: React.FC = () => {
  const [text, setText] = useState('');
  const [cursorVisible, setCursorVisible] = useState(true);
  const fullText = `$ ssh admin@cml.ccielab.net
Password: ********
Welcome to Cisco Modeling Labs - Personal
Last login: Tue May 23 09:15:22 2023 from 192.168.1.10

admin@cml:~$ show topology
Loading network topology...

+---------------------+     +---------------------+
|                     |     |                     |
|    Core Router      |     |    Distribution     |
|    (CSR1000v)       |-----+    Switch (Nexus)   |
|                     |     |                     |
+---------------------+     +---------------------+
          |                           |
          |                           |
+---------------------+     +---------------------+
|                     |     |                     |
|    Access Switch    |     |    Access Switch    |
|    (Catalyst 9300)  |     |    (Catalyst 9300)  |
|                     |     |                     |
+---------------------+     +---------------------+
    |           |               |           |
    |           |               |           |
+-------+   +-------+       +-------+   +-------+
|       |   |       |       |       |   |       |
| Host1 |   | Host2 |       | Host3 |   | Host4 |
|       |   |       |       |       |   |       |
+-------+   +-------+       +-------+   +-------+

admin@cml:~$ _`;

  useEffect(() => {
    // Typing effect
    let i = 0;
    const typingInterval = setInterval(() => {
      if (i < fullText.length) {
        setText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typingInterval);
      }
    }, 30);

    // Cursor blinking effect
    const cursorInterval = setInterval(() => {
      setCursorVisible(prev => !prev);
    }, 500);

    return () => {
      clearInterval(typingInterval);
      clearInterval(cursorInterval);
    };
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <div className="bg-gray-900 rounded-t-lg p-2 flex items-center">
        <div className="flex space-x-2">
          <div className="w-3 h-3 rounded-full bg-red-500"></div>
          <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
          <div className="w-3 h-3 rounded-full bg-green-500"></div>
        </div>
        <div className="mx-auto text-white/70 text-sm">Terminal - CML Lab Environment</div>
      </div>
      <div className="bg-black rounded-b-lg p-4 font-mono text-sm text-green-400 h-80 overflow-auto">
        <pre className="whitespace-pre-wrap">
          {text}
          {cursorVisible && <span className="animate-pulse">|</span>}
        </pre>
      </div>
    </div>
  );
};

export { TerminalMockup }; 