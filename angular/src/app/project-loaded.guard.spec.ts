import { TestBed, async, inject } from '@angular/core/testing';

import { ProjectLoadedGuard } from './project-loaded.guard';

describe('ProjectLoadedGuard', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProjectLoadedGuard]
    });
  });

  it('should ...', inject([ProjectLoadedGuard], (guard: ProjectLoadedGuard) => {
    expect(guard).toBeTruthy();
  }));
});
