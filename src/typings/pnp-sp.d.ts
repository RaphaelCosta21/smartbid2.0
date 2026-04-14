declare module "@pnp/sp" {
  export function spfi(root?: string | SPFI): SPFI;
  export function SPFx(context: any): any;
  export interface SPFI {
    using(...behaviors: any[]): this;
    web: SPWeb;
  }
  export interface SPWeb {
    lists: SPLists;
    siteUsers: SPSiteUsers;
    currentUser: SPCurrentUser;
    getFolderByServerRelativePath(path: string): SPFolder;
    getFileByServerRelativePath(path: string): SPFile;
  }
  export interface SPLists {
    getByTitle(title: string): SPList;
  }
  export interface SPList {
    items: SPItems;
  }
  export interface SPItems {
    filter(query: string): SPItems;
    select(...fields: string[]): SPItems;
    orderBy(field: string, ascending?: boolean): SPItems;
    top(count: number): SPItems;
    getById(id: number): SPItem;
    add(item: Record<string, unknown>): Promise<unknown>;
    (): Promise<unknown[]>;
  }
  export interface SPItem {
    select(...fields: string[]): SPItem;
    update(item: Record<string, unknown>): Promise<unknown>;
    delete(): Promise<void>;
    (): Promise<unknown>;
  }
  export interface SPFolder {
    files: SPFiles;
    addSubFolderUsingPath(name: string): Promise<unknown>;
  }
  export interface SPFiles {
    select(...fields: string[]): SPFiles;
    addUsingPath(
      name: string,
      content: unknown,
      options?: Record<string, unknown>,
    ): Promise<{ data: unknown }>;
    (): Promise<unknown[]>;
  }
  export interface SPFile {
    delete(): Promise<void>;
    getBuffer(): Promise<ArrayBuffer>;
  }
  export interface SPSiteUsers {
    getByEmail(email: string): SPSiteUser;
    filter(query: string): SPSiteUsers;
    select(...fields: string[]): SPSiteUsers;
    top(count: number): SPSiteUsers;
    (): Promise<unknown[]>;
  }
  export interface SPSiteUser {
    select(...fields: string[]): SPSiteUser;
    (): Promise<unknown>;
  }
  export interface SPCurrentUser {
    (): Promise<unknown>;
  }
}
