import {BasicRest} from "../BasicRest";
import {OpenHandler} from "../../handlers/model/OpenHandler";
import Handler from "../../handlers/model/OpenHandler";
import * as HTTPStatus from 'http-status-codes';

export class OpenRest extends BasicRest {
  protected _handler: OpenHandler;

  constructor(router) {
    super(router, Handler);

    this.routes = {
      get:{
        '/locale/:i18n': this.getLocale.bind(this),
      },
      post: {
        '/login': this.login.bind(this),
      }
    };

    this.wiring();
  }

  set handler(value: OpenHandler) {
    this._handler = value;
  }

  get handler(): OpenHandler {
    return this._handler;
  }

  set routes(rotas) {
    this._routes = rotas;
  }

  get routes() {
    return this._routes;
  }

  private async getLocale(req, res){
    let response = await this.handler.getLocale(req.query);
    res
      .status(HTTPStatus.OK)
      .send(response);
  }

  private async login(req, res){
    let response = await this.handler.login(req.body);
    res
      .status(HTTPStatus.OK)
      .send(response);
  }

}