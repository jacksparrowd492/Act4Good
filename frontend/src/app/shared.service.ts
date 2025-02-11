// shared.service.ts

import { EventEmitter, Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
export class SharedService {
    loginEvent: EventEmitter<void> = new EventEmitter < void> ();
    registerEvent: EventEmitter<void> = new EventEmitter < void> ();
    constructor() { }

    triggerLoginEvent(): void {
        this.loginEvent.emit();
    }

    triggerRegisterEvent(): void {
        this.registerEvent.emit();
    }
}
