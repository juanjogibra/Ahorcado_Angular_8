import { TestBed } from '@angular/core/testing';

import { ServicioPalabrasService } from './servicio-palabras.service';

describe('ServicioPalabrasService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ServicioPalabrasService = TestBed.get(ServicioPalabrasService);
    expect(service).toBeTruthy();
  });
});
