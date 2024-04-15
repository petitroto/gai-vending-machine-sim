require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');

const app = express();
const port = 3000;

// Middleware for parsing JSON bodies
app.use(bodyParser.json());

// Serve the static HTML file for the client
app.use(express.static('public'));

const systemPromptContent = `
あなたは自動販売機です。ユーザーが行った操作と自動販売機の状態（預かり金の残高と商品の在庫数）が入力されるたびに、以下の手順に従ってユーザーへ応答してください。

手順1 - 入力された操作イベントが、前回の応答のreason_optionsに含まれるか判断して、もし含まれるなら、その操作に該当する動機に寄り添ったメッセージを出力して、以降の手順をスキップしてください。２つ以上前の応答は判断に使わないでください。この手順の出力は<message>タグで囲んでください。
手順2 - ユーザーによる今回の操作による自動販売機の状態の変化と、これまでの対話の履歴とを合わせて考えて、ユーザーによる今回の操作が「通常の使い方」と判断できるなら、その操作に対応する機能を実行するとともに、ユーザーが次に行うべき操作を案内するメッセージを出力して、以降の手順をスキップしてください。メッセージの出力は<message>タグで囲んでください。
手順3 - ユーザーが異常な操作をした動機を２つまで想像して書いてください。行った操作や商品の種類をよく踏まえてください。この手順の出力は<reasons>タグで囲んでください。
手順4 - 手順3で考えたそれぞれの動機に対して、ユーザーがそれを選択するための操作を決めて、動機と操作の対応関係を <操作イベント名>動機</操作イベント名> という形式で出力してください。選択するための操作イベント名としてInsert100YenCoinを使わないでください。この手順の出力は<reason_options>タグで囲んでください。
手順5 - 「ユーザーが行った操作が異常である旨と、reason_optionsの内容を説明して意思表示を求めるメッセージ」を出力してください。メッセージの例は「買い方がわからんっていうんやったら、コーヒーのボタンを１回押して教えてや」。この手順の出力は<message>タグで囲んでください。

入力に含まれる「ユーザーが今回行った操作」は、操作を表す１つまたは複数の操作イベント名を含み、その意味は以下の通りです。

PushBuyCoffee : コーヒーの購入ボタンを押し下げた
PushBuyCola : コーラの購入ボタンを押し下げた
PushBuyTea : 紅茶の購入ボタンを押し下げた
PushBuyJuice : ジュースの購入ボタンを押し下げた
PushBuyWater : 水の購入ボタンを押し下げた
PushReturnChange : お釣り返却ボタンを押し下げた
Insert100YenCoin : 100円を投入するボタンを押し下げた

メッセージのテキストは関西弁にしてください。ただし、元の情報は漏らさず含めてください。
`

const tools = [
    {
        "type": "function",
        "function": {
            "name": "insertCoin",
            "description": "Increase the balance by 100 yen",
            "parameters": {}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "buyProduct",
            "description": "Dispense the specified product and decrease the balance by 100 yen",
            "parameters": {
                "type": "object",
                "properties": {
                    "product": {
                        "type": "string",
                        "description": "The name of the product to dispense",
                        "enum": ["coffee", "cola", "tea", "juice", "water"]
                    }
                },
                "required": ["product"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "returnChange",
            "description": "Return the remaining balance from the change return slot and set the balance to zero",
            "parameters": {}
        }
    },
    {
        "type": "function",
        "function": {
            "name": "speak",
            "description": "Read the specified message aloud using the Web Speech API",
            "parameters": {
                "type": "object",
                "properties": {
                    "message": {
                        "type": "string",
                        "description": "The message to be read aloud"
                    }
                },
                "required": ["message"]
            }
        }
    }
];

// Assistant API endpoint
app.post('/assistant', async (req, res) => {
    try {
        const conversationHistory = req.body.conversationHistory;
        const systemPrompt = {
            role: "system",
            content: systemPromptContent
        };

        // Add the system prompt to the beginning of the conversation history
        const messages = [systemPrompt, ...conversationHistory];

        // Call the OpenAI Chat Completions API
        const response = await axios.post('https://api.openai.com/v1/chat/completions', {
            model: 'gpt-4-turbo-preview',
            messages: messages,
            tools: tools
        }, {
            headers: {
                'Authorization': `Bearer ${process.env.OPENAI_API_KEY}`,
                'Content-Type': 'application/json'
            }
        });

        // Extract the message object from the response
        const message = response.data.choices[0].message;

        // Send the message object back to the client
        res.json(message);
    } catch (error) {
        console.error(error.message);
        res.status(500).send('An error occurred while processing the request.');
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});
