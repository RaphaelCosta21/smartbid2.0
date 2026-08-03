---
description: "Generate a new SharePoint service class following the static singleton pattern"
mode: agent
---

# Generate SharePoint Service

You are creating a new service class for the SmartBid 2.0 SPFx project.

## Input

The user will provide:

- **Service name** (e.g., `QuotationService`, `PricingService`)
- **SharePoint list/library name** (or ask them to check `sharepoint.config.ts`)
- **Model interface** (e.g., `IQuotation`) — check `models/index.ts` first

## Rules

1. **Static singleton pattern** — no instantiation, all methods `public static`:

   ```typescript
   import { SPService } from "./SPService";
   import { SP_CONFIG } from "../config/sharepoint.config";
   import { IXxx } from "../models";

   export class XxxService {
     public static async getAll(): Promise<IXxx[]> {
       const items = await SPService.sp.web.lists
         .getByTitle(SP_CONFIG.lists.xxxList)
         .items();
       return items.map((item: any) => XxxService.mapFromSP(item));
     }

     public static async getById(id: number): Promise<IXxx | null> {
       const item = await SPService.sp.web.lists
         .getByTitle(SP_CONFIG.lists.xxxList)
         .items.getById(id)();
       return item ? XxxService.mapFromSP(item) : null;
     }

     public static async create(data: Partial<IXxx>): Promise<number> {
       const result = await SPService.sp.web.lists
         .getByTitle(SP_CONFIG.lists.xxxList)
         .items.add(XxxService.mapToSP(data));
       return result.Id;
     }

     private static mapFromSP(item: any): IXxx {
       // Map SharePoint fields → model interface
       // JSON blobs: JSON.parse(item.JsonData || "{}")
     }

     private static mapToSP(data: Partial<IXxx>): Record<string, any> {
       // Map model → SharePoint fields
       // JSON blobs: JSON.stringify(data.complexField)
     }
   }
   ```

2. **List names** come from `SP_CONFIG` in `config/sharepoint.config.ts` — add the list name there if it doesn't exist.

3. **Model interfaces** come from `models/` — create a new `I{Name}.ts` file and export from `models/index.ts` if needed.

4. **Data stored as JSON blobs**: Complex nested data is stored as a single JSON string column in SharePoint. Parse on read, stringify on write.

5. **Error handling**: Let errors propagate — callers (stores/pages) handle errors.

6. **No mock data** — services always talk to SharePoint via `SPService.sp`.

## Output

Create the service file in `src/webparts/smartBid20/app/services/`, update `sharepoint.config.ts` if needed, and create/update the model interface.
