'use strict';

const Controller = require('egg').Controller;
const util = require('../util');
const path = require('path')
const sendToWormhole = require('stream-wormhole');
const uuid = require('node-uuid');
const moment = require('moment');
const fs = require('fs');
const pump = require('pump');

class AttachmentController extends Controller {
  // 上传图片
  async upload() {
    const { ctx } = this;
    let urls = Array();

    const parts = ctx.multipart();
    let part;
    while ((part = await parts()) != null) {
      if (!part.length) {
        if (!part.filename)
          continue;

        const baseDir = process.env.BASE_PIC_DIR;
        const filename = uuid.v4() + path.extname(part.filename);
        const dir = moment().format('YYYYMMDD');
        const _path = path.join(baseDir, dir);
        if (!fs.existsSync(_path))
          fs.mkdirSync(_path);
        const target = path.join(_path, filename);

        try {
          let writeStream = fs.createWriteStream(target);
          await pump(part, writeStream);
          urls.push(process.env.BASE_PIC_URL + dir + '/' + filename);
        } catch (e) {
          await sendToWormhole(part);

          ctx.status = 400;
          ctx.body = util.makeRes('图片上传出错, 请稍后再试, 或联系工作人员', 400);
          return;
        }
      }
    }
    ctx.status = 200;
    ctx.body = util.makeRes('上传成功', 0, { url: urls });
  }
}

module.exports = AttachmentController;