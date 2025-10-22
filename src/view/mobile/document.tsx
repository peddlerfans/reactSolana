import { useState } from "react";
import { Link } from "react-router-dom";

require("./document.css");


export default function Document() {
    let [choiceIndex, changeIndex] = useState(0)

    const onChoiceIndex = (e: any) => {
        console.log(e)
        changeIndex(e)
        changeDrop(false)
    }

    const targetUrl = (url: any)=> {
        console.log('target', url)
        window.open(url)
    }

    const showArticle = () => {
        switch (choiceIndex) {
            case 0: 
                return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article1.png')} alt="" />
                </div>
            case 1: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article2.png')} alt="" />
                </div>
            case 2: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article3.png')} alt="" />
                </div>
            case 3: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article4.png')} alt="" />
                </div>
            case 4: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article5.png')} alt="" />
                </div>
            case 5: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article6.png')} alt="" />
                </div>
            case 6: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article7.png')} alt="" />
                </div>
            case 7: 
            return <div className="img_box_h5">
                    <img src={require('../../static/image/h5/h5_article8.png')} style={{marginBottom: '60px'}} alt="" />
                    {/* Twitter: https://twitter.com/TetriSolBuilder​
                    Telegram: https://t.me/TetriSolBuilder​
                    Dapp: Tetrisol.net */}
                    <div className="link_url_h5" onClick={Event => targetUrl('https://twitter.com/TetrisSol')}>
                        Twitter: https://twitter.com/TetriSolBuilder​
                    </div>

                    <div className="link_url_h5" onClick={Event => targetUrl('https://t.me/TetrisSol')}>
                        Telegram: https://t.me/TetriSolBuilder​
                    </div>

                    <div className="link_url_h5" onClick={Event => targetUrl('https://www.tetrisol.net')}>
                        Dapp: Tetrisol.net
                    </div>
                </div>
            default:
                break;
        }
    }

    let [isShowDrop, changeDrop] = useState<any>(false)

    const showDrop = () => {
        changeDrop(!isShowDrop)
    }

    const colseDrop = () => {
        changeDrop(false)
    }

    return (
      <div className="doc_box_h5">
        <div className="logo_box flex align_center">
            <img src={require('../../static/image/logo.png')} alt="" />
            <Link className="list-group-item" to="/h5/home" style={{marginTop: '2px'}}>TetriSol</Link>

            <img className="tabs_icon" onClick={showDrop} src={require('../../static/image/h5/tabs_icon.png')} alt="" />

            <div className={isShowDrop ? 'dropdown-content show_drop' : 'dropdown-content'}>
                <div className={choiceIndex === 0 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(0)}>
                    Project Introduction
                </div>

                <div className={choiceIndex === 1 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(1)}>
                    Phase S
                </div>

                <div className={choiceIndex === 2 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(2)}>
                    Phase O
                </div>
                
                <div className={choiceIndex === 3 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(3)}>
                    Phase L
                </div>
                
                <div className={choiceIndex === 4 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(4)}>
                    Phase Z
                </div>

                <div className={choiceIndex === 5 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(5)}>
                    Road Map
                </div>

                <div className={choiceIndex === 6 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(6)}>
                    Risk  and Disclaimer
                </div>

                <div className={choiceIndex === 7 ? 'choice_box_h5' : ''} onClick={Event => onChoiceIndex(7)}>
                    Official Links
                </div>
            </div>
        </div>

        <div className="cont_box" onClick={colseDrop}>
           {
            showArticle()
           }
        </div>
      </div>
    );
}