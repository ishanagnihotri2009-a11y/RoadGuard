import re
with open('src/pages/admin/AdminDashboard.tsx', 'r', encoding='utf-8') as f:
    code = f.read()

replacement = '''
            {data.severityBreakdown.some((d:any) => d.value > 0) ? (
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={data.severityBreakdown.filter((d:any) => d.value > 0)} cx="50%" cy="50%" innerRadius={40} outerRadius={70} paddingAngle={2} dataKey="value">
                    {data.severityBreakdown.filter((d:any) => d.value > 0).map((entry: any, index: number) => (
                      <Cell key={"cell-" + index} fill={(COLORS as any)[entry.name]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex items-center justify-center text-slate-400 text-sm">No data</div>
            )}
'''
code = re.sub(r'<ResponsiveContainer width="100%" height="100%">\s*<PieChart>.*?</PieChart>\s*</ResponsiveContainer>', replacement, code, flags=re.DOTALL)

with open('src/pages/admin/AdminDashboard.tsx', 'w', encoding='utf-8') as f:
    f.write(code)