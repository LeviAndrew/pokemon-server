import {BasicHandler} from "../BasicHandler";
import {FindObject} from '../util/FindObject';
import {Application} from '../../Application';
import * as path from 'path';

export class OpenHandler extends BasicHandler {

  /**
   *
   * @param {object} data
   * @returns {Promise<{success: boolean; data: any}>}
   *
   * Return model data, if he has a account or access error if he don't has a account.
   */
  public async login(data: { login: string, password: string }): Promise<{ success: boolean, data: any }> {
    let required = this.attributeValidator(['login', 'password'], data);
    if (!required.success) return await this.getErrorAttributeRequired(required.error);
    let ret = await this.sendToServer('db.user.login', {
      password: data.password,
      queryObject: new FindObject({
        query: {
          email: data.login,
          removed: false,
        },
        select: 'id name surname email password type authenticationKey',
      }),
    });
    if(ret.data.error) return await this.returnHandler({
      model: 'user',
      data: ret.data,
    });
    let accessKey = await this.sendToServer('accessSession.create', ret.data.success.authenticationKey);
    if(accessKey.data.error) return await this.returnHandler({
      model: 'user',
      data: accessKey.data,
    });
    ret.data.success.accessKey = accessKey.data.success;
    return await this.returnHandler({
      model: 'user',
      data: ret.data,
    });
  }

  public async getLocale(data) {
    let dataLocale = Application.getPathI18N();
    let i18n = data.i18n ? data.i18n : dataLocale.defaultI18N;
    let ret = await this.getI18N({path: path.resolve(`${dataLocale.mainPath}/${i18n}/${dataLocale.i18n}`)});
    return await this.returnHandler({
      model: 'global',
      data: ret
    })
  }

}

export default new OpenHandler();