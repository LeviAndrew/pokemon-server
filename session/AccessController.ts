import {Source} from "../events/Source";
import {Types} from "mongoose";

export class AccessController extends Source {
  private readonly _keysMap;
  private readonly _name: string;
  constructor() {
    super();
    this._keysMap = new Map();
    this._name = "accessSession";
    this.wiring();
  }

  private get name(){
    return this._name;
  }

  private get map(){
    return this._keysMap;
  };

  private accessSessionCreate(msg){
    if (msg.source_id === this.id) return;
    let timeStamp = new Date().getTime();
    let accessKey = new Types.ObjectId().toString();
    if(this.map.get(msg.data.success))return this.answer(msg.id, msg.event, null, 'userAlreadyLogged');
    this.map.set(msg.data.success, {
      timeStamp,
      accessKey,
    });
    this.answer(msg.id, msg.event, accessKey, null);
  }

  private isValid(msg){
    if(msg.source_id === this.id) return;
    if(this.map.get(msg.data.success.authenticationKey)){
      if(this.map.get(msg.data.success.authenticationKey).accessKey === msg.data.success.accessKey){
        return this.answer(msg.id, msg.event, true, null);
      }
    }
    return this.answer(msg.id, msg.event, null, true);
  }

  private removeKey(msg){
    if(msg.source_id === this.id) return;
    if(this.map.get(msg.data.success.authenticationKey)){
      if(this.map.get(msg.data.success.authenticationKey).accessKey === msg.data.success.accessKey){
        this.map.delete(msg.data.success.authenticationKey);
        return this.answer(msg.id, msg.event, true, null);
      }
      return this.answer(msg.id, msg.event, null, 'invalidAccessKey');
    }
    return this.answer(msg.id, msg.event, null, 'invalidAuthenticationKey');
  }

  /**
   *
   * @param messageId
   * @param event
   * @param success
   * @param error
   *
   * Make a answer to a message represented for a messageId param.
   */
  answer(messageId, event, success, error) {
    let data = {
      success: success,
      error: error
    };
    this.hub.send(this, event, data, messageId);
  }

  wiring() {
    this.hub.on(`${this.name}.create`, this.accessSessionCreate.bind(this));
    this.hub.on(`${this.name}.isValid`, this.isValid.bind(this));
    this.hub.on(`${this.name}.removeKey`, this.removeKey.bind(this));
  }
}