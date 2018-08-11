import React, { Component, PropTypes } from 'react';
import _ from 'lodash';
import cheerio from 'cheerio';
import { autobind } from 'core-decorators';
import { render } from 'react-dom';
import Command, { Separator } from './Command';
import CommandFormatBlock from './CommandFormatBlock';
import CommandColor from './CommandColor';
import CommandPrompt from './CommandPrompt';
import CommandCustom from './CommandCustom';
import parseToBB from './parseToBB';
// import { insertTextIntoEditor } from '../common/editor';
import { updateConfig } from '../../../options/OptionPage';
import EmotionPicker from '../EmotionPicker';
import StickerPicker from '../StickerPicker';
import { GET } from '../../utils/http';

const RMB_KEY = 'voz_living_post_data';

/** TODOs:
 * /Handle image paste & update
 * /Insert emo panels and handle insertion
 * /Insert quotes
 * /configuration - setting
 * /roll out
 * Handle Advanced editor page
 * -- advanced
 * Nested div and zero size div
 */

function doSubmit() {
  const btns = ['#vB_Editor_001_save', '#qr_submit'];
  for (let i = 0; i < btns.length; i++) {
    const btn = document.querySelector(btns[i]);
    if (btn !== null) {
      btn.click();
      return;
    }
  }
}

function doPreview() {
  document.querySelector('[name="preview"]').click();
}

function isInTag(target, tagName) {
  do {
    if (target.contentEditable === 'true' && target.classList.contains('editor')) return false;
    if (target.tagName && target.tagName.toUpperCase() === tagName) {
      return true;
    }
    target = target.parentElement;
  } while (target !== null);
  return false;
}

function saveEditing(content) {
  localStorage.setItem(RMB_KEY, content);
}

function clearEditing() {
  localStorage.removeItem(RMB_KEY);
}

@autobind
class Editor extends Component {
  static propTypes = {
    target: PropTypes.string,
    stickerPanelExpand: PropTypes.bool.isRequired,
    currentView: PropTypes.string,
  }

  constructor(comProps) {
    super(comProps);

    this.editableNode = null;
    this.onChangeThrottled = _.throttle(this.onChange, 500);
  }

  componentWillReceiveProps(nextProps) {

  }

  shouldComponentUpdate(nextProps) {
    return false;
  }

  componentDidMount() {
    require('./style.less');
    this.addRichQuoteToPosts();
  }

  addRichQuoteToPosts() {
    document.querySelectorAll('img[src$="/images/buttons/multiquote_off.gif"][id^=mq]').forEach((node) => {
      const a = node.parentElement;
      const postId = node.id.match(/\d+/)[0];
      const aq = document.createElement('a');
      aq.className = 'rich-quote';
      aq.setAttribute('data-tooltip', 'Trích dẫn');
      aq.addEventListener('click', () => {
        this.onQuotePost(postId);
      })
      const i = document.createElement('i');
      i.className = 'fa fa-quote-right';
      aq.appendChild(i);
      a.insertAdjacentElement('beforebegin', aq);
    });
  }

  onQuotePost(postId) {
    const content = document.querySelector(`#post_message_${postId}`);
    const user = document.querySelector(`#postmenu_${postId} .bigusername`).textContent;
    const html = `<quote data-by="${user}">${content}</quote>`;
    const quote = document.createElement('quote');
    const emptyLine = document.createElement('br');
    quote.setAttribute('data-by', user);
    quote.appendChild(content.cloneNode(true));
    this.editableNode.appendChild(quote);
    this.editableNode.appendChild(emptyLine);
    const href = `//forums.voz.vn/newreply.php?do=newreply&p=${postId}`;
    GET(href).then(response => { // eslint-disable-line
      const $ = cheerio.load(response);
      const text = $('#vB_Editor_001_textarea').val();
      quote.setAttribute('data-bbcode', text);
    });
  }

  onChange(e) {
    // console.log('Change')
    // const { target } = this.props;
    // const bbcode = parseToBB(this.editableNode);
    // document.getElementById(target).value = bbcode;
  }

  onKeyDown(e) {
    if (e.keyCode === 13 && e.shiftKey === false) {
      const selection = document.getSelection();
      if (selection && selection.anchorNode) {
        if (isInTag(selection.anchorNode, 'QUOTE')) {
          e.preventDefault();
          document.execCommand('insertHTML', false, '&nbsp;');
          document.execCommand('insertHTML', false, '<br />');
          return false;
        }
      }
    }
    return true;
  }

  turnFeatureOff(e) {
    e.preventDefault();
    updateConfig('enableRichEditor', false)
        .then(() => { location.reload(); });
    return false;
  }

  submit(e) {
    this.toBBCode(e);
    clearEditing();
    doSubmit();
  }

  onIconClick(emotion) {
    document.execCommand('insertimage', false, emotion.src);
  }

  onStickerClick(sticker) {
    document.execCommand('insertimage', false, sticker.url);
  }

  toBBCode(e) {
    if (e) e.preventDefault();
    const bbcode = parseToBB(this.editableNode);
    const { target } = this.props;
    document.getElementById(target).value = bbcode;
    return false;
  }

  preview(e) {
    e.preventDefault();
    this.toBBCode(e);
    saveEditing(this.editableNode.innerHTML);
    doPreview();
    return false;
  }

  addNewLine(e) {
    const div = document.createElement('div');
    div.innerHTML = '&nbsp;';
    this.editableNode.appendChild(div);
    setTimeout(() => div.focus(), 200);
    e.preventDefault();
    return false;
  }

  render() {
    const { stickerPanelExpand } = this.props;
    let prevData = localStorage.getItem(RMB_KEY);
    if (prevData === null) prevData = '<br /><br />';
    prevData = prevData.replace(/script>/g, ''); // prevent xss

    return (
      <div className="editor-wrapper">
        <div className="toolbar">
          <CommandColor
            command="forecolor"
            palette={['black', 'sienna', 'darkolivegreen', 'darkgreen', 'darkslateblue', 'navy', 'indigo', 'darkslategray', 'darkred', 'darkorange', 'olive', 'green', 'teal', 'blue', 'slategray', 'dimgray', 'red', 'sandybrown', 'yellowgreen', 'seagreen', 'mediumturquoise', 'royalblue', 'purple', 'gray', 'magenta', 'orange', 'yellow', 'lime', 'cyan', 'deepskyblue', 'darkorchid', 'silver', 'pink', 'wheat', 'lemonchiffon', 'palegreen', 'paleturquoise', 'lightblue', 'plum', 'white']}
            tt="Màu chữ"
          />
          {/*
          <div className="fore-wrapper"><i className="fa fa-font" style="color:#C96;"></i>
            <div className="fore-palette">
            </div>
          </div>
          <div className="back-wrapper"><i className="fa fa-font" style="background:#C96;"></i>
            <div className="back-palette">
            </div>
          </div>
          */}
          <Command command="bold" faClass="bold" tt="Bôi đậm" />
          <Command command="italic" faClass="italic" tt="In nghiêng" />
          <Command command="underline" faClass="underline" tt="Gạch chân" />
          <Command command="strikeThrough" faClass="strikethrough" tt="Gạch chữ" />
          <Separator />
          <Command command="justifyLeft" faClass="align-left" tt="Canh trái" />
          <Command command="justifyCenter" faClass="align-center" tt="Canh giữa" />
          <Command command="justifyRight" faClass="align-right" tt="Canh phải" />
          <Separator />
          <Command command="indent" faClass="indent" tt="Thụt vào" />
          <Command command="outdent" faClass="outdent" tt="Thụt ra" />
          <CommandCustom html={'<quote>__SELECTION__</quote>'} label={<i className="fa fa-quote-right"></i>} tt="Khung trích dẫn" />
          <Command command="insertUnorderedList" faClass="list-ul" tt="Đánh danh sách" />
          <Command command="insertOrderedList" faClass="list-ol" tt="Đánh số" />
          <Separator />
          <CommandPrompt command="createlink" faClass="link" ask="Link:" def="http://" tt="Chèn link" />
          <Command command="unlink" faClass="unlink" tt="Xoá link" />
          <CommandPrompt command="insertimage" faClass="image" ask="Link:" def="http://" tt="Chèn ảnh" />
          <Separator />
          <CommandFormatBlock block="h1" tt="Tiêu đề (SIZE=7)" />
          <CommandFormatBlock block="h2" tt="Tiêu đề (SIZE=6)" />
          <CommandFormatBlock block="h3" tt="Tiêu đề (SIZE=5)" />
          <CommandFormatBlock block="h4" tt="Tiêu đề (SIZE=4)" />
          <Separator />
          <CommandFormatBlock block="p" tt="Định dạng đoạn văn" />
          <Separator />
          <Command command="undo" faClass="undo" tt="Undo" />
          <Command command="redo" faClass="repeat" tt="Redo" />
        </div>
        <div
          className="editor"
          contentEditable="true"
          onInput={this.onChangeThrottled}
          onKeyDown={this.onKeyDown}
          ref={(editableNode) => { this.editableNode = editableNode; }}
          dangerouslySetInnerHTML={{ __html: prevData }}
        >
        </div>
        <div className="RE-btn-control">
          <a href="#" onClick={this.addNewLine} style={{ position: 'relative' }} data-tooltip="Thêm dòng mới ở dưới cùng">Thêm dòng mới</a>&nbsp;|&nbsp;
          <a href="#" onClick={this.turnFeatureOff} style={{ position: 'relative' }} data-tooltip="Tắt và load lại trang">Tắt WYSIWYG Editor</a> &nbsp;|&nbsp;
          <a href="https://forums.voz.vn/newreply.php?do=newreply&p=124977693" target="_blank" style={{ position: 'relative' }} data-tooltip="Mở ra trang mới">Góp ý</a>
          <div style={{ float: 'right' }}>
            <button onClick={this.toBBCode} data-tooltip="Không gửi bài" style={{ position: 'relative' }} data-tooltip="Không gửi bài">To BBCode</button>
            <button onClick={this.preview}>Preview</button>
            <button onClick={this.submit}>Gửi bài</button>
          </div>
        </div>
        <div style={{ clear: 'both' }}>
          <div className="">
            <StickerPicker onStickerClick={this.onStickerClick} stickerPanelExpand={stickerPanelExpand} />
            <div className="smilebox">
              <EmotionPicker onIconClick={this.onIconClick} />
            </div>
          </div>
        </div>
        <div>
          Ô Reply ở phía dưới chỉ nhằm mục đích tham khảo, bạn có thể nhấn vào <img src="https://forums.voz.vn/images/buttons/collapse_tcat.gif" /> để đóng tạm
        </div>
      </div>
    );
  }
}

export default Editor;
