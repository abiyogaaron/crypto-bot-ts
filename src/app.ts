import config from './environment';
import telebot from 'telebot';
import * as indicators from 'trading-indicator';
import { INDODAX_BASE_URL, COMMAND_LIST, EXCHANGE_CODE } from './constant';
import { ECOMMAND_LIST, EHTTP_METHOD } from './interface';
import APIService from './service';

const cryptoBot = new telebot({
  token: config.telegram_api_key,
});

const sendErrMessage = (msg, err) => {
  cryptoBot.sendMessage(msg.from.id, err.toString());
}

const sendSuccesMessage = (msg, text) => {
  cryptoBot.sendMessage(
    msg.from.id, text
  );
}

cryptoBot.on(COMMAND_LIST, async (msg) => {
  const command = msg.text.split(' ')[0].toLowerCase();
  const pair = msg.text.split(' ')[1];

  console.log("command ----> ", command);
  console.log("pair ---->", pair);

  if (command === ECOMMAND_LIST.MARKET_DEPTH) {
    try {
      const res: any = await APIService.apiCall(EHTTP_METHOD.GET, `${INDODAX_BASE_URL}/${pair}/depth`);
      if (res.data) {
        if (res.data.buy.length > 0 && res.data.sell.length > 0) {
          const buyPower = res.data.buy.reduce((acc, item) => {
            return acc + parseFloat(item[1]);
          }, 0)
          const sellPower = res.data.sell.reduce((acc, item) => {
            return acc + parseFloat(item[1]);
          }, 0);
          
          let extensionMsg = 'buy power greater than sell power';
          if (buyPower < sellPower) {
            extensionMsg = 'sell power greater than buy power';
          }
          sendSuccesMessage(msg, `${pair.toUpperCase()}\nBuy power: ${buyPower}\nSell power: ${sellPower}\n\n${extensionMsg}`);
        }
      }
    } catch(err) {
      sendErrMessage(msg, err)
    }
  } else if (command === ECOMMAND_LIST.ORDER_BOOK) {
    try {
      const res: any = await APIService.apiCall(EHTTP_METHOD.GET, `${INDODAX_BASE_URL}/${pair}/trades`);
      if (res.data) {
        const buyBook = res.data.filter(item => {
          return item.type === 'buy'
        });
        const sellBook = res.data.filter(item => {
          return item.type === 'sell'
        });
        
        const buyTotalAmount = buyBook.reduce((acc, item) => {
          return acc + parseFloat(item.amount);
        }, 0);
        const sellTotalAmount = sellBook.reduce((acc, item) => {
          return acc + parseFloat(item.amount);
        }, 0);

        let extensionMsg = 'buy order book greater than sell order book';
        if (buyTotalAmount < sellTotalAmount) {
          extensionMsg = 'sell order book greater than buy order book';
        }
        sendSuccesMessage(
          msg,
          `${pair.toUpperCase()}\nTotal data: ${res.data.length}\n\nBuy amount: ${buyTotalAmount}\nSell amount: ${sellTotalAmount}\n\n${extensionMsg}`
        );
      }
    } catch(err) {
      sendErrMessage(msg, err)
    }
  } else if (command === ECOMMAND_LIST.MA_CROSSING) {
    try {
      const ma_fast = msg.text.split(' ')[2];
      const ma_slow = msg.text.split(' ')[3];
      const timeframe = msg.text.split(' ')[4];
      const res = await indicators.alerts.maCross(
        ma_fast,
        ma_slow,
        EXCHANGE_CODE,
        pair.toUpperCase(),
        timeframe,
        false,
      );

      sendSuccesMessage(
        msg,
        `${pair.toUpperCase()}\nMA(${ma_fast},${ma_slow}) crossing: \n\nGolden Cross: ${res.goldenCross}\nDeath Cross: ${res.deathCross}`
      );
    } catch(err) {
      sendErrMessage(msg, err)
    }
  } else if (command === ECOMMAND_LIST.RSI_ALERT) {
    try {
      const timeframe = msg.text.split(' ')[2];
      const res = await indicators.alerts.rsiCheck(
        14,
        70,
        30,
        EXCHANGE_CODE,
        pair.toUpperCase(),
        timeframe,
        false,
      )
      console.log(res)
      sendSuccesMessage(
        msg,
        `${pair.toUpperCase()}\nRSI value: ${res.rsiVal}\n\nOverbought: ${res.overBought}\nOversold: ${res.overSold}`
      );
    } catch (err) {
      sendErrMessage(msg, err)
    }
  }
});

cryptoBot.start();




