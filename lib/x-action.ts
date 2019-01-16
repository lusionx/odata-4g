import { EntityType } from "./conv"


export function patch(t: EntityType) {
    const fs: string[] = []
    for (const p of t.Property) {
        if (p.Type === 'Edm.Int32') {
            fs.push(' '.repeat(8) + `if (m.${p.Name} != 0)`)
        } else if (p.Type === 'Edm.String') {
            fs.push(' '.repeat(8) + `if (m.${p.Name} != null)`)
        } else if (p.Type === 'Edm.DateTimeOffset') {
            fs.push(' '.repeat(8) + `if (m.${p.Name} != DateTime.MinValue)`)
        } else {
            fs.push(' '.repeat(8) + `if (m.${p.Name} != )`)
        }
        fs.push(' '.repeat(8) + '{')
        fs.push(' '.repeat(12) + `e.${p.Name} = m.${p.Name};`)
        fs.push(' '.repeat(8) + '}')
    }
    return `
    [EnableQuery]
    public IActionResult Patch(int key, [FromBody]${t.Name} m)
    {
        var e = _db.${t.Name}.FirstOrDefault(c => c.Id == key);
        if (e == null)
        {
            return NotFound();
        }
${fs.join('\n')}
        _db.SaveChanges();
        return Ok(e);
    }`
}
