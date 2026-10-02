import re

with open('src/services/reports.service.ts', 'r', encoding='utf-8') as f:
    code = f.read()

code = code.replace(
    'subscribeToUserReports: (userId: string, callback: (reports: Report[]) => void) => {',
    'subscribeToUserReports: (userId: string, callback: (reports: Report[]) => void, onError?: (error: Error) => void) => {'
)

code = code.replace(
    'subscribeToPublicReports: (callback: (reports: Report[]) => void) => {',
    'subscribeToPublicReports: (callback: (reports: Report[]) => void, onError?: (error: Error) => void) => {'
)

code = code.replace(
    'subscribeToReport: (reportId: string, callback: (report: Report | null) => void) => {',
    'subscribeToReport: (reportId: string, callback: (report: Report | null) => void, onError?: (error: Error) => void) => {'
)

with open('src/services/reports.service.ts', 'w', encoding='utf-8') as f:
    f.write(code)