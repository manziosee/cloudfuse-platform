"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.KubernetesService = void 0;
var common_1 = require("@nestjs/common");
var client_node_1 = require("@kubernetes/client-node");
var KubernetesService = function () {
    var _classDecorators = [(0, common_1.Injectable)()];
    var _classDescriptor;
    var _classExtraInitializers = [];
    var _classThis;
    var KubernetesService = _classThis = /** @class */ (function () {
        function KubernetesService_1(configService) {
            this.configService = configService;
            this.logger = new common_1.Logger(KubernetesService.name);
            this.kubeConfig = new client_node_1.KubeConfig();
            this.kubeConfig.loadFromDefault();
            this.appsApi = this.kubeConfig.makeApiClient(client_node_1.AppsV1Api);
            this.coreApi = this.kubeConfig.makeApiClient(client_node_1.CoreV1Api);
            this.networkingApi = this.kubeConfig.makeApiClient(client_node_1.NetworkingV1Api);
            this.namespace = this.configService.get('kubernetes.namespace');
        }
        KubernetesService_1.prototype.createDeployment = function (namespace, deployment) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_1;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.appsApi.createNamespacedDeployment(namespace || this.namespace, deployment)];
                        case 1:
                            response = _b.sent();
                            this.logger.log("Deployment created: ".concat(deployment.metadata.name));
                            return [2 /*return*/, response.body];
                        case 2:
                            error_1 = _b.sent();
                            this.logger.error("Error creating deployment: ".concat(((_a = error_1 === null || error_1 === void 0 ? void 0 : error_1.body) === null || _a === void 0 ? void 0 : _a.message) || error_1.message));
                            throw error_1;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        KubernetesService_1.prototype.createService = function (namespace, service) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_2;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.coreApi.createNamespacedService(namespace || this.namespace, service)];
                        case 1:
                            response = _b.sent();
                            this.logger.log("Service created: ".concat(service.metadata.name));
                            return [2 /*return*/, response.body];
                        case 2:
                            error_2 = _b.sent();
                            this.logger.error("Error creating service: ".concat(((_a = error_2 === null || error_2 === void 0 ? void 0 : error_2.body) === null || _a === void 0 ? void 0 : _a.message) || error_2.message));
                            throw error_2;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        KubernetesService_1.prototype.createIngress = function (namespace, ingress) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_3;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.networkingApi.createNamespacedIngress(namespace || this.namespace, ingress)];
                        case 1:
                            response = _b.sent();
                            this.logger.log("Ingress created: ".concat(ingress.metadata.name));
                            return [2 /*return*/, response.body];
                        case 2:
                            error_3 = _b.sent();
                            this.logger.error("Error creating ingress: ".concat(((_a = error_3 === null || error_3 === void 0 ? void 0 : error_3.body) === null || _a === void 0 ? void 0 : _a.message) || error_3.message));
                            throw error_3;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        KubernetesService_1.prototype.getDeploymentStatus = function (namespace, name) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_4;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.appsApi.readNamespacedDeploymentStatus(name, namespace || this.namespace)];
                        case 1:
                            response = _b.sent();
                            return [2 /*return*/, response.body.status];
                        case 2:
                            error_4 = _b.sent();
                            this.logger.error("Error getting deployment status: ".concat(((_a = error_4 === null || error_4 === void 0 ? void 0 : error_4.body) === null || _a === void 0 ? void 0 : _a.message) || error_4.message));
                            throw error_4;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        KubernetesService_1.prototype.deleteDeployment = function (namespace, name) {
            return __awaiter(this, void 0, void 0, function () {
                var response, error_5;
                var _a;
                return __generator(this, function (_b) {
                    switch (_b.label) {
                        case 0:
                            _b.trys.push([0, 2, , 3]);
                            return [4 /*yield*/, this.appsApi.deleteNamespacedDeployment(name, namespace || this.namespace)];
                        case 1:
                            response = _b.sent();
                            this.logger.log("Deployment deleted: ".concat(name));
                            return [2 /*return*/, response.body];
                        case 2:
                            error_5 = _b.sent();
                            this.logger.error("Error deleting deployment: ".concat(((_a = error_5 === null || error_5 === void 0 ? void 0 : error_5.body) === null || _a === void 0 ? void 0 : _a.message) || error_5.message));
                            throw error_5;
                        case 3: return [2 /*return*/];
                    }
                });
            });
        };
        return KubernetesService_1;
    }());
    __setFunctionName(_classThis, "KubernetesService");
    (function () {
        var _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        KubernetesService = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return KubernetesService = _classThis;
}();
exports.KubernetesService = KubernetesService;
