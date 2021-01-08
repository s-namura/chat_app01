import consumer from "./consumer"

// turbolinks の読み込みが終わった後にidを取得しないと，エラーが出ます。
document.addEventListener('turbolinks:load', () => {

    // js.erb 内で使用できるように変数を定義しておく
    window.messageContainer = document.getElementById('message-container')

    // 以下のプログラムが他のページで動作しないようにしておく
    if (messageContainer === null) {
        return
    }
    consumer.subscriptions.create("RoomChannel", {
      connected() {
        // Called when the subscription is ready for use on the server
        },

      disconnected() {
        // Called when the subscription has been terminated by the server
      },

      received(data) {
      
      // Called when there's incoming data on the websocket for this channel
      // サーバー側から受け取ったHTMLを一番最後に加える
            messageContainer.insertAdjacentHTML('beforeend', data['message'])
      }
    })
    // ********** 以下を追加 **********
    const documentElement = document.documentElement
    // js.erb 内でも使用できるように変数を決定
    window.messageContent = document.getElementById('message_content')
    // 一番下まで移動する関数。js.erb 内でも使用できるように変数を決定
    window.scrollToBottom = () => {
        window.scroll(0, documentElement.scrollHeight)
    }

    // 最初にページ一番下へ移動させる
    scrollToBottom()
    // ********** 以上を追加 **********
// ********** 以下を追加 **********
    const messageButton = document.getElementById('message-button')

    // 空欄でなければボタンを有効化，空欄なら無効化する関数
    const button_activation = () => {
        if (messageContent.value === '') {
            messageButton.classList.add('disabled')
        } else {
            messageButton.classList.remove('disabled')
        }
    }

    // フォームに入力した際の動作
    messageContent.addEventListener('input', () => {
        button_activation()
    // ********** 以下を追加 **********
        changeLineCheck()
    // ********** 以上を追加 **********
    })

    // 送信ボタンが押された時にボタンを無効化
    messageButton.addEventListener('click', () => {
        messageButton.classList.add('disabled')
    // ********** 以下を追加 **********
        changeLineCount(1)
    // ********** 以上を追加 **********

    })
    // ********** 以上を追加 **********

    // ********** 以下を追加 **********
    // フォームの最大行数を決定
    const maxLineCount = 10

    // 入力メッセージの行数を調べる関数
    const getLineCount = () => {
        return (messageContent.value + '\n').match(/\r?\n/g).length;
    }

    let lineCount = getLineCount()
    let newLineCount

    const changeLineCheck = () => {
        // 現在の入力行数を取得（ただし，最大の行数は maxLineCount とする）
        newLineCount = Math.min(getLineCount(), maxLineCount)
        // 以前の入力行数と異なる場合は変更する
        if (lineCount !== newLineCount) {
            changeLineCount(newLineCount)
        }
    }

    // ********** 以下を追加 **********
    const footer = document.getElementById('footer')
    let footerHeight = footer.scrollHeight
    let newFooterHeight, footerHeightDiff
    // ********** 以上を追加 **********

    const changeLineCount = (newLineCount) => {
        // フォームの行数を変更
        messageContent.rows = lineCount = newLineCount
      // ********** 以下を追加 **********
        // 新しいフッターの高さを取得し，違いを計算
        newFooterHeight = footer.scrollHeight
        footerHeightDiff = newFooterHeight - footerHeight
        // 新しいフッターの高さをチャット欄の padding-bottom に反映し，スクロールさせる
        // 行数が増える時と減る時で操作順を変更しないとうまくいかない
        if (footerHeightDiff > 0) {
            messageContainer.style.paddingBottom = newFooterHeight + 'px'
            window.scrollBy(0, footerHeightDiff)
        } else {
            window.scrollBy(0, footerHeightDiff)
            messageContainer.style.paddingBottom = newFooterHeight + 'px'
        }
        footerHeight = newFooterHeight
    // ********** 以上を追加 **********
      }
    // ********** 以上を追加 **********

  })
