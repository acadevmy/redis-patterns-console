import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

import { environment } from '@app/../environments/environment';
import { Command } from '@app/shared/models/command.interface';
import { Pattern } from '@app/shared/models/pattern.interface';
import { CachingService } from '@app/core/services/caching.service';
import { GithubContent } from '@app/shared/models/github-content.interface';

@Injectable({
  providedIn: 'root'
})

export class GithubDataService {
  private redisDocPath = environment.redisDocRepo.path;
  private patternsPath = environment.patternsRepo.path;

  constructor(private http: HttpClient, private cachingService: CachingService) { }

  /**
   * Fetch all available commands from remote git repo
   */
  fetchCommands() {
    const endpoint = this.getEndpoint(this.redisDocPath, environment.redisDocRepo.json);

    return this.http.get<GithubContent>(endpoint).pipe(
      map((contentFile) => {
        const decodedCommands: Command[] = JSON.parse(atob(contentFile.content));
        return Object.keys(decodedCommands).map((key) => ({ key, ...decodedCommands[key]}));
      }),
      catchError(() => of([]))
    );
  }

  /**
   * Fetch documentation relative to input command
   * @param command name of command
   */
  fetchDocumentation(command: string) {
    const headers = this.cachingService.cacheableHeaderObj;
    const file = environment.redisDocRepo.doc.replace('_file', command.replace(' ', '-').toLowerCase());
    const endpoint = this.getEndpoint(this.redisDocPath, file);

    return this.http.get<GithubContent>(endpoint, { headers }).pipe(
        map((contentFile) => atob(contentFile.content)),
        catchError(() => of('No documentation found'))
      );
  }

  /**
   * Fetch available pattern list
   *
   * @returns Observable<Pattern[]>
   */
  fetchPatterns(): Observable<Pattern[]> {
    const endpoint = this.getEndpoint(this.patternsPath, environment.patternsRepo.json);

    return this.http.get<GithubContent | string>(endpoint).pipe(
        map((contentFile: any) => {
          const decodedPatterns: Pattern[] = JSON.parse(atob(contentFile.content));
          return Object.keys(decodedPatterns).map((key) => ({ key, ...decodedPatterns[key]}));
        }),
        catchError(() => of([]))
      );
  }

  /**
   * Fetch active pattern content file
   * @param key the key of active pattern
   *
   * @returns Observable<string>
   */
  fetchPattern(key: string): Observable<string> {
    const headers = this.cachingService.cacheableHeaderObj;
    const endpoint = this.getEndpoint(this.patternsPath, `${key}.md`);

    return this.http.get<GithubContent | string>(endpoint, { headers }).pipe(
        map((contentFile: any) => atob(contentFile.content)),
        catchError(() => of('No pattern found'))
      );
  }

  /**
   * Format url for http request
   * @param repo repo path where fetch from
   * @param file file path to get
   */
  private getEndpoint(repo: string, file: string): string {
    return environment.githubEndpoint.replace('_repo_', repo).replace('_file_', file);
  }
}
