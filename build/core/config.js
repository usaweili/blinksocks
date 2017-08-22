'use strict';Object.defineProperty(exports,'__esModule',{value:true});exports.Config=exports.DEFAULT_BEHAVIOURS=exports.DEFAULT_LOG_LEVEL=undefined;var _extends=Object.assign||function(target){for(var i=1;i<arguments.length;i++){var source=arguments[i];for(var key in source){if(Object.prototype.hasOwnProperty.call(source,key)){target[key]=source[key]}}}return target};var _dns=require('dns');var _dns2=_interopRequireDefault(_dns);var _fs=require('fs');var _fs2=_interopRequireDefault(_fs);var _path=require('path');var _path2=_interopRequireDefault(_path);var _os=require('os');var _os2=_interopRequireDefault(_os);var _net=require('net');var _net2=_interopRequireDefault(_net);var _winston=require('winston');var _winston2=_interopRequireDefault(_winston);var _lodash=require('lodash.isplainobject');var _lodash2=_interopRequireDefault(_lodash);var _behaviours=require('../behaviours');var _presets=require('../presets');var _utils=require('../utils');var _dnsCache=require('./dns-cache');function _interopRequireDefault(obj){return obj&&obj.__esModule?obj:{default:obj}}const DEFAULT_LOG_LEVEL=exports.DEFAULT_LOG_LEVEL='info';const DEFAULT_BEHAVIOURS=exports.DEFAULT_BEHAVIOURS={[_behaviours.BEHAVIOUR_EVENT_ON_PRESET_FAILED]:{'name':'random-timeout','params':{'min':10,'max':40}}};class Config{static validate(json){if(!(0,_lodash2.default)(json)){throw Error('invalid configuration file')}if(typeof json.host!=='string'||json.host===''){throw Error('\'host\' must be provided and is not empty')}if(!(0,_utils.isValidPort)(json.port)){throw Error('\'port\' is invalid')}if(json.behaviours!==undefined){if(!(0,_lodash2.default)(json.behaviours)){throw Error('\'behaviours\' is invalid')}const events=Object.keys(json.behaviours);var _iteratorNormalCompletion=true;var _didIteratorError=false;var _iteratorError=undefined;try{for(var _iterator=events[Symbol.iterator](),_step;!(_iteratorNormalCompletion=(_step=_iterator.next()).done);_iteratorNormalCompletion=true){const event=_step.value;if(!_behaviours.behaviourEvents.includes(event)){throw Error(`unrecognized behaviour event: "${event}"`)}var _json$behaviours$even=json.behaviours[event];const name=_json$behaviours$even.name,params=_json$behaviours$even.params;if(typeof name!=='string'){throw Error('\'behaviours[].name\' must be a string')}if(name===''){throw Error('\'behaviours[].name\' cannot be empty')}if(params!==undefined&&!(0,_lodash2.default)(params)){throw Error('\'behaviours[].params\' must be an plain object')}const behaviour=(0,_behaviours.getBehaviourClassByName)(name);delete new behaviour(params||{})}}catch(err){_didIteratorError=true;_iteratorError=err}finally{try{if(!_iteratorNormalCompletion&&_iterator.return){_iterator.return()}}finally{if(_didIteratorError){throw _iteratorError}}}}if(json.servers!==undefined){if(!Array.isArray(json.servers)){throw Error('\'servers\' must be provided as an array')}const servers=json.servers.filter(server=>server.enabled===true);if(servers.length<1){throw Error('\'servers\' must have at least one enabled item')}servers.forEach(this.validateServer)}else{this.validateServer(json)}if(json.timeout!==undefined){if(typeof json.timeout!=='number'){throw Error('\'timeout\' must be a number')}if(json.timeout<1){throw Error('\'timeout\' must be greater than 0')}if(json.timeout<60){console.warn(`==> [config] 'timeout' is too short, is ${json.timeout}s expected?`)}}if(json.log_path!==undefined){if(typeof json.log_path!=='string'){throw Error('\'log_path\' must be a string')}}if(json.log_level!==undefined){const levels=['error','warn','info','verbose','debug','silly'];if(!levels.includes(json.log_level)){throw Error(`'log_level' must be one of [${levels.toString()}]`)}}if(json.workers!==undefined){if(typeof json.workers!=='number'){throw Error('\'workers\' must be a number')}if(json.workers<0){throw Error('\'workers\' must be an integer')}if(json.workers>_os2.default.cpus().length){console.warn(`==> [config] 'workers' is greater than the number of cpus, is ${json.workers} workers expected?`)}}if(json.dns!==undefined){if(!Array.isArray(json.dns)){throw Error('\'dns\' must be an array')}var _iteratorNormalCompletion2=true;var _didIteratorError2=false;var _iteratorError2=undefined;try{for(var _iterator2=json.dns[Symbol.iterator](),_step2;!(_iteratorNormalCompletion2=(_step2=_iterator2.next()).done);_iteratorNormalCompletion2=true){const ip=_step2.value;if(!_net2.default.isIP(ip)){throw Error(`"${ip}" is not an ip address`)}}}catch(err){_didIteratorError2=true;_iteratorError2=err}finally{try{if(!_iteratorNormalCompletion2&&_iterator2.return){_iterator2.return()}}finally{if(_didIteratorError2){throw _iteratorError2}}}}if(json.dns_expire!==undefined){if(typeof json.dns_expire!=='number'){throw Error('\'dns_expire\' must be a number')}if(json.dns_expire<0){throw Error('\'dns_expire\' must be greater or equal to 0')}if(json.dns_expire>24*60*60){console.warn(`==> [config] 'dns_expire' is too long, is ${json.dns_expire}s expected?`)}}}static validateServer(server){if(server.transport!==undefined){if(!['tcp','tls'].includes(server.transport)){throw Error('\'server.transport\' must be "tcp" or "tls"')}if(server.transport==='tls'){if(typeof server.tls_cert!=='string'){throw Error('\'server.tls_key\' must be a string')}if(server.tls_cert===''){throw Error('\'server.tls_cert\' cannot be empty')}}}if(!(0,_utils.isValidHostname)(server.host)){throw Error('\'server.host\' is invalid')}if(!(0,_utils.isValidPort)(server.port)){throw Error('\'server.port\' is invalid')}if(typeof server.key!=='string'||server.key===''){throw Error('\'server.key\' must be a non-empty string')}if(!Array.isArray(server.presets)){throw Error('\'server.presets\' must be an array')}if(server.presets.length<1){throw Error('\'server.presets\' must contain at least one preset')}var _iteratorNormalCompletion3=true;var _didIteratorError3=false;var _iteratorError3=undefined;try{for(var _iterator3=server.presets[Symbol.iterator](),_step3;!(_iteratorNormalCompletion3=(_step3=_iterator3.next()).done);_iteratorNormalCompletion3=true){const preset=_step3.value;const name=preset.name,params=preset.params;if(typeof name!=='string'){throw Error('\'server.presets[].name\' must be a string')}if(name===''){throw Error('\'server.presets[].name\' cannot be empty')}if(params!==undefined){if(!(0,_lodash2.default)(params)){throw Error('\'server.presets[].params\' must be an plain object')}}const ps=(0,_presets.getPresetClassByName)(preset.name);delete new ps(params||{})}}catch(err){_didIteratorError3=true;_iteratorError3=err}finally{try{if(!_iteratorNormalCompletion3&&_iterator3.return){_iterator3.return()}}finally{if(_didIteratorError3){throw _iteratorError3}}}}static init(json){this.validate(json);global.__LOCAL_HOST__=json.host;global.__LOCAL_PORT__=json.port;if(json.servers!==undefined){global.__SERVERS__=json.servers.filter(server=>server.enabled);global.__IS_CLIENT__=true;global.__IS_SERVER__=false}else{global.__IS_CLIENT__=false;global.__IS_SERVER__=true;this.initServer(json)}global.__TIMEOUT__=json.timeout!==undefined?json.timeout*1e3:600*1e3;global.__WORKERS__=json.workers!==undefined?json.workers:0;global.__DNS_EXPIRE__=json.dns_expire!==undefined?json.dns_expire*1e3:_dnsCache.DNS_DEFAULT_EXPIRE;global.__ALL_CONFIG__=json;if(json.dns!==undefined&&json.dns.length>0){global.__DNS__=json.dns;_dns2.default.setServers(json.dns)}const absolutePath=_path2.default.resolve(process.cwd(),json.log_path||'.');let isFile=false;if(_fs2.default.existsSync(absolutePath)){isFile=_fs2.default.statSync(absolutePath).isFile()}else if(_path2.default.extname(absolutePath)!==''){isFile=true}global.__LOG_PATH__=isFile?absolutePath:_path2.default.join(absolutePath,`bs-${__IS_CLIENT__?'client':'server'}.log`);global.__LOG_LEVEL__=json.log_level!==undefined?json.log_level:DEFAULT_LOG_LEVEL;_utils.logger.configure({level:__LOG_LEVEL__,transports:[new _winston2.default.transports.Console({colorize:true,prettyPrint:true}),new(require('winston-daily-rotate-file'))({filename:__LOG_PATH__,level:__LOG_LEVEL__})]});const behaviours=_extends({},DEFAULT_BEHAVIOURS,json.behaviours!==undefined?json.behaviours:{});const events=Object.keys(behaviours);global.__BEHAVIOURS__={};var _iteratorNormalCompletion4=true;var _didIteratorError4=false;var _iteratorError4=undefined;try{for(var _iterator4=events[Symbol.iterator](),_step4;!(_iteratorNormalCompletion4=(_step4=_iterator4.next()).done);_iteratorNormalCompletion4=true){const ev=_step4.value;const clazz=(0,_behaviours.getBehaviourClassByName)(behaviours[ev].name);global.__BEHAVIOURS__[ev]=new clazz(behaviours[ev].params||{})}}catch(err){_didIteratorError4=true;_iteratorError4=err}finally{try{if(!_iteratorNormalCompletion4&&_iterator4.return){_iterator4.return()}}finally{if(_didIteratorError4){throw _iteratorError4}}}}static initServer(server){this.validateServer(server);global.__TRANSPORT__=server.transport!==undefined?server.transport:'tcp';global.__IS_TLS__=__TRANSPORT__==='tls';if(__IS_TLS__){global.__TLS_CERT__=_fs2.default.readFileSync(_path2.default.resolve(process.cwd(),server.tls_cert));if(__IS_SERVER__){global.__TLS_KEY__=_fs2.default.readFileSync(_path2.default.resolve(process.cwd(),server.tls_key))}}global.__SERVER_HOST__=server.host;global.__SERVER_PORT__=server.port;global.__KEY__=server.key;global.__PRESETS__=server.presets}}exports.Config=Config;