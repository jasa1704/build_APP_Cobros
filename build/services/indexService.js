"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class IndexService {
    index(request, response) {
        return response.send("AppSusPozos Gestion de Cobros");
    }
}
exports.indexService = new IndexService();
